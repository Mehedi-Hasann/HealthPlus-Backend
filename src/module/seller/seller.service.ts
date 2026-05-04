import { prisma } from "../../lib/prisma";
import { Medicine, Order } from "../../generated/client";
import { ICreateMedicine } from "./seller.medicine";

const createMedicine = async(payload : ICreateMedicine) => {
  console.log(payload)

  const category = await prisma.category.findUniqueOrThrow({
    where : {
      categoryName : payload.categoryName
    }
  })
  console.log(category);
  
  const result = await prisma.medicine.create({
    data : {
      ...payload,
      categoryId : category.id
    }
  })
  console.log("result is => ",result);
  return result;
}

const updateMedicine = async(payload : Omit<Medicine,"id" | "categoryId" | "categoryName">, id: string) => {
  // console.log({payload, id});
  await prisma.medicine.findUniqueOrThrow({
    where : {
      id
    }
  })

  const result = await prisma.medicine.update({
    where : {
      id : id
    },
    data : {
      name : payload.name,
      price : payload.price,
      stock : payload.stock
    }
  })
  // console.log(result);
  return result;
}

const deleteMedicine = async(id : string) => {
  // console.log({id});
  await prisma.medicine.findUniqueOrThrow({
    where : {
      id
    }
  })

  try {
    const result = await prisma.medicine.delete({
      where : {
        id
      }
    })

    return result;
  } catch (error) {
    // console.log(error);
    throw new Error("Medicine is not Exists!")
  }
}

const getAllOrder = async() => {
  const result = await prisma.order.findMany();

  return result;
}

const updateStatus = async(payload : Pick<Order , "orderStatus" | "paymentStatus">,id : string) => {
  console.log(id);
  console.log(payload);
  await prisma.order.findUniqueOrThrow({
    where : {
      id
    }
  })

  const result = await prisma.order.update({
    where : {
      id
    },
    data : payload
  })
  console.log(result);

  return result;
}

export const sellerServices = {
  createMedicine,updateMedicine,deleteMedicine,getAllOrder, updateStatus
}