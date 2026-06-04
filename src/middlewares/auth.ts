/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { envVars } from "../config/env";
import { prisma } from "../lib/prisma";
import { CookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";
import { Role, UserStatus } from "../generated/enums";
import AppError from "../errorHelper/AppError";

declare global {
  namespace Express {
    interface Request {
      user ?: {
        id : string;
        name ?: string;
        email : string;
        role : string;
        status ?: string;
        emailVerified ?: boolean;
      }
    }
  }
}

export const auth = (...authRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Session Token Verification
        const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token") || 
                             CookieUtils.getCookie(req, "__Secure-better-auth.session_token");

        if (!sessionToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No session token provided.');
        }
        console.log("session token is => ",sessionToken);

        const parsedSessionToken = sessionToken.split(".")[0] ?? "";

        const sessionExists = await prisma.session.findFirst({
            where: {
                token: parsedSessionToken
            },
            include: {
                user: true,
            }
        });
        console.log("Session is => ",sessionExists);

        if (!sessionExists) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Session has expired or is invalid.');
        }

        const accessToken = CookieUtils.getCookie(req, 'accessToken');

        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No access token provided.');
        }

        //Access Token Verification
        // console.log("accessToken is => ",accessToken);

        const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

        if (!verifiedToken.success) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Invalid access token.');
        }
        // console.log(verifiedToken.data?.userId);
                req.user = {
                    id : verifiedToken.data?.userId,
                    role : verifiedToken.data?.role,
                    email : verifiedToken.data?.email,
                }
                // console.log(req.user)

        if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data!.role as Role)) {
            throw new AppError(status.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
        }

        next()
    } catch (error: any) {
        next(error);
    }
};