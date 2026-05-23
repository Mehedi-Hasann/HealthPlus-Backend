import { Role, User } from "../../generated/client";
import { prisma } from "../../lib/prisma"

const getAllUser = async(page : number, limit: number) => {
  const data = await prisma.user.findMany({
    take : limit,
    skip : (page-1)*limit
  });


  const totalUser = await prisma.user.count();


  return {data,page, limit, totalUser, totalPage : Math.ceil(totalUser/limit)};
}

const updateUserStatus = async(payload : Pick<User, "userStatus" | "emailVerified">,id : string) => {

  console.log(payload)

  await prisma.user.findUniqueOrThrow({
    where : {
      id
    }
  })

  const result = await prisma.user.update({
    where : {
      id
    },
    data : {
      userStatus : payload.userStatus,
      emailVerified : payload.emailVerified
    }
  })

  return result;
}

const getStats = async() => {
  return await prisma.$transaction(async (tx) => {
    const [totalUser,totalCustomer,totalSeller,totalOrder,totalOrderAmount,totalMedicine,totalCategory] = await Promise.all([
      await prisma.user.count(),
      await prisma.user.count({where : {role : Role.CUSTOMER}}),
      await prisma.user.count({where : {role : Role.SELLER}}),
      await prisma.order.count(),
      await prisma.order.aggregate({_sum : {totalAmount : true}}),
      await prisma.medicine.count(),
      await prisma.category.count()
    ]);

    return {
      totalUser,
      totalCustomer,
      totalSeller,
      totalOrder,
      totalOrderAmount : totalOrderAmount._sum.totalAmount,
      totalMedicine,
      totalCategory
    }
  })
}

export const adminService = {
  getAllUser, updateUserStatus, getStats
}