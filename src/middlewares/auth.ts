import { RequestHandler } from 'express';

import { assertActiveUser, findUserById, verifyAccessToken } from '@/modules/auth/auth.utils';
import { Role } from '@/shared/constend/auth.const';
import { AppError } from '@/shared/errors/AppError';
import { catchAsync } from '@/shared/utils/catchAsync';

export const auth = (...allowedRoles: Role[]): RequestHandler =>
  catchAsync(async (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Unauthorized: Token missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError(401, 'Unauthorized: Invalid token');
    }

    const decoded = verifyAccessToken(token);

    const user = await findUserById(decoded.userId);

    if (!user) {
      throw new AppError(401, 'Unauthorized: User not found');
    }

    assertActiveUser(user.status);

    req.user = {
      userId: user.id,
      tenantId: user.tenantId!,
      role: user.role as Role,
    };

    // ✅ 🔥 SUPER ADMIN BYPASS
    if ((req.user.role as Role) === Role.SUPER_ADMIN) {
      return next();
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role as Role)) {
      throw new AppError(403, 'Forbidden');
    }

    next();
  });
