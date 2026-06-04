import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { Role, User, UserStatus } from "../../generated/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { IChangePassword, ILoginUserPayload, IRegisterCustomerPayload } from "./auth.interface";

const registerCustomer = async (payload : IRegisterCustomerPayload) => {
  const {name , email , password, image} = payload;

  if(!name || !email || !password){
    throw new Error("All fields are required");
  }

  const data = await auth.api.signUpEmail({
    body : {
      name,
      email,
      password,
      role : Role.CUSTOMER,
      image
    }
  })
  console.log(data);

  if(!data.user){
    throw new Error("Failed to create user");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    name : data.user.name,
    email : data.user.email,
    role : data.user.role,
    userStatus : data.user.userStatus,
    emailVerified : data.user.emailVerified,
    isDeleted : data.user.isDeleted,
    needPasswordChange : data.user.needPasswordChange
  })

  const refreshToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    name : data.user.name,
    email : data.user.email,
    role : data.user.role,
    userStatus : data.user.userStatus,
    emailVerified : data.user.emailVerified,
    isDeleted : data.user.isDeleted,
    needPasswordChange : data.user.needPasswordChange
  })

  const customerTx = await prisma.customer.create({
              data : {
                userId : data.user.id,
                name : data.user.name,
                email : data.user.email
              }
            });
  
  await prisma.user.update({
                  where : {
                    id : customerTx.userId,
                    role : Role.CUSTOMER
                  },
                  data : {
                    emailVerified : true
                  }
              });

  const signInData = await auth.api.signInEmail({
    body : {
      email,
      password
    }
  });

  return {
    ...signInData,
    accessToken,
    refreshToken
  }
}

const loginUser = async (payload : ILoginUserPayload) => {
  // console.log(payload);
  const email = payload.email;
  const password = payload.password;

  if(!email || !password){
    throw new Error("All fields are required");
  }

  const data = await auth.api.signInEmail({
    body : {
      email,
      password
    }
  })
  if(!data.user){
    throw new Error("Invalid credentials");
  }

  if(data.user.isDeleted || data.user.userStatus === UserStatus.DELETED){
    throw new Error("Your account is deleted.");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    name : data.user.name,
    email : data.user.email,
    role : data.user.role,
    userStatus : data.user.userStatus,
    emailVerified : data.user.emailVerified,
    isDeleted : data.user.isDeleted,
    needPasswordChange : data.user.needPasswordChange
  })

  const refreshToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    name : data.user.name,
    email : data.user.email,
    role : data.user.role,
    userStatus : data.user.userStatus,
    emailVerified : data.user.emailVerified,
    isDeleted : data.user.isDeleted,
    needPasswordChange : data.user.needPasswordChange
  })


  return {
    ...data,
    accessToken,
    refreshToken
  };
}

const changePassword = async(payload : IChangePassword, sessionToken: string) => {

  const session = await auth.api.getSession({
    headers : new Headers({
      Authorization : `Bearer ${sessionToken}`
    })
  });

  if(!session){
    throw new AppError(status.UNAUTHORIZED, "Invalid session token")
  }

  const {currentPassword, newPassword} = payload;

  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions : true
    },
    headers : new Headers({
      Authorization : `Bearer ${sessionToken}`
    })
  })

  if(session.user.needPasswordChange){
    await prisma.user.update({
      where : {
        id : session.user.id
      },
      data : {
        needPasswordChange : false
      }
    })
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    name : session.user.name,
    email : session.user.email,
    role : session.user.role,
    userStatus : session.user.userStatus,
    emailVerified : session.user.emailVerified,
    isDeleted : session.user.isDeleted,
    needPasswordChange : session.user.needPasswordChange
  })

  const refreshToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    name : session.user.name,
    email : session.user.email,
    role : session.user.role,
    userStatus : session.user.userStatus,
    emailVerified : session.user.emailVerified,
    isDeleted : session.user.isDeleted,
    needPasswordChange : session.user.needPasswordChange
  })

  return {
    ...result,
    accessToken,
    refreshToken
  }

}

const logoutUser = async(sessionToken : string) => {
  const result = await auth.api.signOut({
    headers : new Headers({
      Authorization : `Bearer ${sessionToken}`
    })
  })

  return result
}

const verifyEmail = async (email : string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body : {
      email,
      otp
    }
  })

  if(result.status && !result.user.emailVerified){
    await prisma.user.update({
      where : {
        email
      },
      data : {
        emailVerified : true
      }
    })
  }

}

const sessionToToken = async (sessionToken: string | undefined) => {
  if (!sessionToken) {
    throw new AppError(status.UNAUTHORIZED, "Session token is missing");
  }

  const parsedSessionToken = sessionToken.split(".")[0] ?? "";

  const sessionExists = await prisma.session.findFirst({
    where: {
      token: parsedSessionToken,
      expiresAt: {
        gt: new Date(),
      }
    },
    include: {
      user: true,
    }
  });

  if (!sessionExists) {
    throw new AppError(status.UNAUTHORIZED, "Session has expired or is invalid");
  }

  const user = sessionExists.user;

  // Ensure Customer/Seller/Admin profile exists
  if (user.role === Role.CUSTOMER) {
    const customer = await prisma.customer.findUnique({
      where: { userId: user.id }
    });
    if (!customer) {
      await prisma.customer.create({
        data: {
          userId: user.id,
          name: user.name || user.email.split('@')[0] || "",
          email: user.email,
        }
      });
    }
  } else if (user.role === Role.SELLER) {
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id }
    });
    if (!seller) {
      await prisma.seller.create({
        data: {
          userId: user.id,
          name: user.name || user.email.split('@')[0] || "",
          email: user.email,
        }
      });
    }
  } else if (user.role === Role.ADMIN) {
    const admin = await prisma.admin.findUnique({
      where: { userId: user.id }
    });
    if (!admin) {
      await prisma.admin.create({
        data: {
          userId: user.id,
          name: user.name || user.email.split('@')[0] || "",
          email: user.email,
        }
      });
    }
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: user.id,
    name : user.name,
    email : user.email,
    role : user.role,
    userStatus : user.userStatus,
    emailVerified : user.emailVerified,
    isDeleted : user.isDeleted,
    needPasswordChange : user.needPasswordChange
  });

  const refreshToken = tokenUtils.getAccessToken({
    userId: user.id,
    name : user.name,
    email : user.email,
    role : user.role,
    userStatus : user.userStatus,
    emailVerified : user.emailVerified,
    isDeleted : user.isDeleted,
    needPasswordChange : user.needPasswordChange
  });

  return {
    accessToken,
    refreshToken,
    token: sessionToken,
    user
  };
};

export const AuthService = {
  registerCustomer,
  loginUser,
  changePassword,
  logoutUser,
  verifyEmail,
  sessionToToken
}