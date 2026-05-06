import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { Address, Review, User } from "../../generated/client";
import { prisma } from "../../lib/prisma"
import { EditUser } from "../../types/type";
import { IReview, IUpdateAddress } from "./customer.interface";

const getMyProfile = async (id : string) => {
  
  const res = await prisma.user.findUniqueOrThrow({
    where : {
      id
    },
    select : {
      id : true,
      role : true,
      name : true,
      email : true,
      image : true
    }
  })

  const addressInfo = await prisma.address.findUnique({
    where : {
      userId : res.id
    },
    select : {
      fullName : true,
      phone : true,
      city : true,
      area : true,
      street : true,
      houseNo : true,
      postalCode : true,
    }
  })
  
  return {
    user : res,
    address : addressInfo
  };
}

const getMyOrder = async (id : string) => {
  // console.log(id);
  const res = await prisma.order.findMany({
    where : {
      userId : id
    },
    include : {
      medicine : {
        select : {
          name : true,
          price : true,
          categoryName : true,
          image : true,
        }
      }
    },
  })
  // console.log(res);
  return res;
}

const editMyProfile = async (payload : EditUser, userId : string) => {
  const res = await prisma.user.update({
    where : {
      id : userId
    },
    data : {
      name : payload.name,
      email : payload.email
    }
  })
  // console.log(res);

  return res;
}

const getSingleOrder = async (id : string) => {
  // console.log(id);
  const res = await prisma.order.findUniqueOrThrow({
    where : {
      id
    }
  })
  // console.log(res);
  return res;
}

const addShippingAddress = async (payload : {city : string}, userId : string) => {
  const user = await prisma.address.update({
    where : {
      userId
    },
    data : {
      city : payload.city
    }
  })
  console.log(user);

  return user;
}

const AddItemToCard = async(payload : {medicineId : string}, userId : string) => {
  // console.log(payload);
  const res = await prisma.cart.upsert({
    where : {
      userId_medicineId : {
        userId,
        medicineId : payload.medicineId
      }
    },
    update : {
      quantity : {
        increment : 1
      }
    },
    create : {
      userId,
      medicineId : payload.medicineId
    }
  })
  // console.log(res);

  return res;
}

const getMyCartItem = async (userId : string) => {

  const cartItem = await prisma.cart.findMany({
    where : {
      userId
    }
  })
  return cartItem;
}

const getMySingleCartItem = async (id : string) => {

  const cartItem = await prisma.cart.findUnique({
    where : {
      id
    }
  })
  // console.log(cartItem);
  return cartItem;
}

const DecrementCartItem = async(payload : {medicineId : string}, userId : string) => {

  const checkItem = await prisma.cart.findUnique({
        where : {
          userId_medicineId : {
            userId,
            medicineId : payload.medicineId
          }
        }
  })
  // console.log(checkItem);
  if(checkItem?.quantity === 1 || checkItem?.quantity === null){
    throw new Error ("Quantity Cannot be Negative")
  }

  const res = await prisma.cart.upsert({
    where : {
      userId_medicineId : {
        userId,
        medicineId : payload.medicineId
      }
    },
    update : {
      quantity : {
        decrement : 1
      }
    },
    create : {
      userId,
      medicineId : payload.medicineId
    }
  })
  console.log(res);

  return res;
}

const deleteCartItem = async(id : string) => {
  // console.log(payload);
  const res = await prisma.cart.delete({
    where : {
      id
    }
  })
  // console.log(res);

  return res;
}

const createAddress = async (payload : Address, userId : string) => {

  const res = await prisma.address.create({
    data : {
      ...payload,
      userId
    }
  })

  return res;
}

const updateAddress = async(payload : IUpdateAddress, userId: string) => {
  // console.log(payload);

  const updateAddress = await prisma.address.upsert({
    where : {
      userId
    },
    update : {
      ...payload
    },
    create : {
      ...payload,
      userId
    }
  })
  console.log(updateAddress)

  return updateAddress;
}

const getMyAddress = async (userId : string) => {
  // console.log(userId);
  const res = await prisma.address.findUniqueOrThrow({
    where : {
      userId
    }
  })
  // console.log(res);
  return res;
}

const createReview = async (payload : IReview, userId : string) => {
  console.log('payload ',payload);
  console.log(userId)
  await prisma.user.findUniqueOrThrow({
    where : {
      id : userId
    },
  })
    const res = await prisma.review.create({
    data : {
      ...payload,
      userId
    }
  })
      
  console.log('res ',res);
  return res;
}

const getReview = async (userId : string) => {

  const res = await prisma.review.findMany({
    where : {
      userId
    }
  })
  // console.log(res);
  return res;
}

const getSingleMedicineReview = async (medicineId : string) => {

  const res = await prisma.review.findMany({
    where : {
      medicineId
    }
  })
  // console.log(res);
  return res;
}

export const customerService = {
  getMyProfile,getMyOrder,editMyProfile, getSingleOrder, addShippingAddress, AddItemToCard, getMyCartItem, getMySingleCartItem, DecrementCartItem,deleteCartItem, createAddress,updateAddress, getMyAddress, createReview, getReview, getSingleMedicineReview
}