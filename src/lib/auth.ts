import { betterAuth} from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import nodemailer from "nodemailer"
import { prisma } from "./prisma";
import { Role, UserStatus } from "../generated/enums";
import { envVars } from "../config/env";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";

import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family : 4,
  auth: {
    user: envVars.APP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  }
} as SMTPTransport.Options);

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins : [
      envVars.FRONTEND_URL,
      envVars.APP_URL],
    user : {
      additionalFields : {
        role : {
          type : "string",
          defaultValue : Role.CUSTOMER,
          required : false
        },
        userStatus : {
          type : "string",
          defaultValue : UserStatus.ACTIVE,
          required : false
        },
        needPasswordChange : { 
          type : "boolean", 
          defaultValue : false, 
          required : false 
        },
        isDeleted : {
          type : "boolean",
          defaultValue : false,
          required : false
        },
        deletedAt : { 
          type : "date", 
          defaultValue : null, 
          required : false, 
        }
    }
    },
    emailAndPassword : {
      enabled : true,
      autoSignIn : false,
      requireEmailVerification : true
    },

    plugins : [
      bearer(),
      emailOTP({
        overrideDefaultEmailVerification : true,
        async sendVerificationOTP({email, otp, type}){
          if(type==='email-verification'){
            const user = await prisma.user.findUnique({
              where : {
                email
              }
            })

          if(user && !user.emailVerified){
            sendEmail({
              to: email,
              subject : "Verify your Email",
              templateName : "otp",
              templateData : {
                name : user.name,
                otp
              }
            })
          }
          }
        },
        expiresIn : 2 * 60, // 2 min in seconds
        otpLength : 6,
      })
    ],

    emailVerification: {
        sendOnSignUp : true,
        sendOnSignIn : true,
        autoSignInAfterVerification : true,
        sendVerificationEmail: async ( { user, url, token }, request) => {
          try {
            const verificationUrl = `${envVars.APP_URL}/verify-email?token=${token}`;
          
            const info = await transporter.sendMail({
                  from: '"fgg" <u1904067@student.cuet.ac.bd>',
                  to: user.email,
                  subject: "Email verification for Medi Store",
                  text: "Hello world?",
                  html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verification</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background-color:#2f80ed; padding:20px; text-align:center;">
                    <h1 style="margin:0; color:#ffffff; font-size:24px;">Medi Store</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px; color:#333333;">
                    <h2 style="margin-top:0;">Verify your email address</h2>
                    <p style="font-size:15px; line-height:1.6;">
                      Thanks for signing up with <strong>Medi Store</strong>.
                      Please confirm your email address by clicking the button below.
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                      <a href="${verificationUrl}"
                        style="background-color:#2f80ed; color:#ffffff; text-decoration:none;
                                padding:12px 24px; border-radius:5px; font-size:16px; display:inline-block;">
                        Verify Email
                      </a>
                    </div>

                    <p style="font-size:14px; line-height:1.6; color:#555555;">
                      If the button doesn’t work, copy and paste this link into your browser:
                    </p>
                    <p style="word-break:break-all; font-size:13px; color:#2f80ed;">
                      ${verificationUrl}
                    </p>

                    <p style="font-size:14px; color:#777777;">
                      If you didn’t create an account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#888888;">
                    © 2026 Medi Store. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
                        `,
                  });

                  console.log("Message sent:", info.messageId);
            } catch (error) {
              console.log("An Error Occur to send Email",error);
              throw error;
            }
        },
    },
    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: envVars.GOOGLE_CLIENT_ID as string, 
            clientSecret: envVars.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});