export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'User logged in successfully',
  LOGOUT_SUCCESS: 'User logged out successfully',
  REFRESH_SUCCESS: 'Access token refreshed successfully',

  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_ALREADY_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  ME_SUCCESS: 'User profile retrieved successfully',
} as const;
