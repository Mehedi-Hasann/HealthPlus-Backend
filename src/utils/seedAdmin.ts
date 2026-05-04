import { envVars } from "../config/env";
import { Role, UserStatus } from "../generated/enums";
import { prisma } from "../lib/prisma";

export async function seedAdmin() {
  try {
    const adminEmail = envVars.ADMIN_EMAIL;
    const adminPassword = envVars.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required");
    }

    const adminData = {
      name : "Admin",
      email : adminEmail,
      role : Role.ADMIN,
      password : adminPassword,
      status : UserStatus.ACTIVE
    };

    const isExist = await prisma.user.findUnique({
      where : {
        email : adminData.email
      }
    });
    if(isExist){
      throw new Error("Admin Already Exist.")
    };
    const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": envVars.FRONTEND_URL,
            },
            body: JSON.stringify(adminData)
    })
    // console.log(signUpAdmin.ok);
    if(signUpAdmin.ok){
      await prisma.user.update({
        where : {
          email : adminEmail
        },
        data : {
          emailVerified : true
        }
      })
    }
    console.log("Success to create the ADMIN");

  } catch (error) {
    console.log(error);
    throw error;
  }
}

seedAdmin();