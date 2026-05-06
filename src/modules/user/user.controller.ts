import { StatusCodes } from "http-status-codes";

import { catchAsync } from "@/shared/utils/catchAsync";
import { sendResponse } from "@/shared/utils/sendResponse";


// const me = catchAsync(async (req, res) => {
//   const userId = req.user?.userId;
//   const result = await AuthServices.me(userId);

//   sendResponse(res, StatusCodes.OK, {
//     success: true,
//     message: AUTH_MESSAGES.ME_SUCCESS,
//     data: result,
//   });
// }); 


export const UserController = {
  // Define your user-related controller functions here
}