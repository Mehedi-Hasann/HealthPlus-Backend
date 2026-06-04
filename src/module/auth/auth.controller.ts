import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import status from "http-status";


const registerCustomer = catchAsync(
  async (req: Request, res: Response) => {

    const payload = {
      ...req.body,
      image : req.file?.path
    };

    const result = await AuthService.registerCustomer(payload);

    const {accessToken, refreshToken, token, ...rest} = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);

    sendResponse(res, {
      httpStatusCode : 201,
      success : true,
      message : "Customer registered successfully",
      data : {
        token,
        accessToken,
        refreshToken,
        ...rest
      }
    })
  }
)

const loginUser = catchAsync(
  async (req: Request, res: Response) => {

    const payload = req.body;
    // console.log(payload);

    const result = await AuthService.loginUser(payload);

    const {accessToken, refreshToken, token, ...rest} = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);

    sendResponse(res, {
      httpStatusCode : 200,
      success : true,
      message : "User logged in successfully",
      data : {
        token,
        accessToken,
        refreshToken,
        ...rest
      }
    })
  }
)

const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const sessionToken = req.cookies['better-auth.session_token'] || req.cookies['__Secure-better-auth.session_token'];
    // console.log(sessionToken);

    const result =await AuthService.changePassword(payload, sessionToken);
    // console.log(result);

    const {accessToken, refreshToken, token} = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Password Change Successfully",
      data : result
    })

  }
)

const logoutUser = catchAsync(
  async (req: Request, res: Response) => {
    const sessionToken = req.cookies['better-auth.session_token'] || req.cookies['__Secure-better-auth.session_token'];

    const result = await AuthService.logoutUser(sessionToken);

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "User Log Out Successfully",
      data : result
    })

  }
)

const verifyEmail = catchAsync(
  async (req: Request, res: Response) => {
    const {email, otp} = req.body;
    const result = await AuthService.verifyEmail(email,otp);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success : true,
      message : "Email verified successfully"
    })
  }
)

const sessionToToken = catchAsync(
  async (req: Request, res: Response) => {
    const sessionToken = req.cookies['better-auth.session_token'] || req.cookies['__Secure-better-auth.session_token'] || req.headers['x-session-token'];

    const result = await AuthService.sessionToToken(sessionToken as string | undefined);

    const { accessToken, refreshToken, token, user } = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);

    sendResponse(res, {
      httpStatusCode : 200,
      success : true,
      message : "Session token exchanged successfully",
      data : {
        accessToken,
        refreshToken,
        token,
        user
      }
    })
  }
)

export const AuthController = {
  registerCustomer,loginUser,changePassword,logoutUser, verifyEmail, sessionToToken
}