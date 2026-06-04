import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../config/env";
import { Response } from "express";
import { CookieUtils } from "./cookie";

const getAccessToken = (payload : JwtPayload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    {expiresIn : envVars.ACCESS_TOKEN_EXPIRES_IN} as SignOptions
  )
  return accessToken;
}

const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_EXPIRES_IN,
    {expiresIn : envVars.REFRESH_TOKEN_EXPIRES_IN} as SignOptions
  )
  return refreshToken;
}

const setAccessTokenCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, 'accessToken', token, {
    httpOnly : true,
    secure : true,
    sameSite : "none",
    path: '/',
    maxAge : 60*60*24*1000*10
  })
}

const setRefreshTokenCookie = (res: Response, token: string) => {
    CookieUtils.setCookie(res, 'refreshToken', token, {
      httpOnly : true,
      secure : true,
      sameSite : "none",
      path : '/',
      maxAge : 60*60*24*1000*20
    })
}

const setBetterAuthSessionCookie = (res: Response, token: string) => {
    CookieUtils.setCookie(res, 'better-auth.session_token', token, {
      httpOnly : true,
      secure : true,
      sameSite : "none",
      path : '/',
      maxAge : 60*60*24*1000*10
    })
}
const clearAccessTokenCookie = (res: Response) => {
  CookieUtils.clearCookie(res, 'accessToken', {
    httpOnly : true,
    secure : true,
    sameSite : "none",
    path: '/'
  })
}

const clearRefreshTokenCookie = (res: Response) => {
  CookieUtils.clearCookie(res, 'refreshToken', {
    httpOnly : true,
    secure : true,
    sameSite : "none",
    path: '/'
  })
}

const clearBetterAuthSessionCookie = (res: Response) => {
  CookieUtils.clearCookie(res, 'better-auth.session_token', {
    httpOnly : true,
    secure : true,
    sameSite : "none",
    path: '/'
  })
  CookieUtils.clearCookie(res, '__Secure-better-auth.session_token', {
    httpOnly : true,
    secure : true,
    sameSite : "none",
    path: '/'
  })
}

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
  clearBetterAuthSessionCookie
}