import { Order, OrderStatus, PaymentStatus } from "../../generated/client";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../config/stripe.config";
import {v7 as uuidv7 } from "uuid";
import { envVars } from "../../config/env";

const createOrder = async(payload : Order, userId : string) => {
  // console.log('order create - > ', payload);
  // console.log('User Id => ', userId)

    const medicineExists = await prisma.medicine.findUnique({
        where : {
          id : payload.medicineId
        }
    });

  if (!medicineExists) {
    throw new Error("Medicine is not Found! Try again later");
  }
  if(medicineExists?.stock < payload.quantity) {
      throw new Error("Insufficient medicine stock!");
  }

  const medicine = await prisma.medicine.update({
    where : {
      id : payload.medicineId
    },
    data : {
      stock : {
        decrement : payload.quantity
      }
    }
  });


  
  //TODO: Payment record will be created with default status UNPAID, and will be updated to PAID when we receive the webhook event from Stripe after successful payment
  // console.log('order create - > ', payload);

  const result = await prisma.$transaction(async (tx) => {

    const transactionId = String(uuidv7());

    const orderData = await prisma.order.create({
      data : {
        userId,
        medicineId : payload.medicineId,
        orderStatus : OrderStatus.PENDING,
        quantity : payload.quantity,
        totalAmount : (medicine?.price ?? 0) * payload.quantity,
        addressId : payload.addressId
      }
    })

      const paymentData = await tx.payment.create({
          data : {
            amount : (medicine?.price ?? 0) * payload.quantity,
            transactionId,
            orderId : orderData.id,
            userId : userId
          }
      })

      const session = await stripe.checkout.sessions.create({
        payment_method_types : ["card"],
        mode : 'payment',
        line_items : [
           {
            price_data : {
              currency : 'bdt',
              product_data : {
                name : `Payment for Medicine ${medicine?.name}`,
              },
              unit_amount : Math.round(((medicine?.price ?? 0) * payload.quantity) * 100) // amount in cents
            },
            quantity : 1,
           }
        ],
        metadata : {
          orderId : orderData.id,
          paymentId : paymentData.id
        },

        success_url : `${envVars.FRONTEND_URL}/cart?success=true`,
        cancel_url : `${envVars.FRONTEND_URL}/cart?success=false`
      })

      return {
        orderData,
        paymentData,
        paymentUrl : session.url
      } 
  });

  return {
    order : result.orderData,
    payment : result.paymentData,
    paymentUrl : result.paymentUrl
  }
}

const getAllOrder = async(id : string, page : number, limit : number) => {
  const data = await prisma.order.findMany({
    take : limit,
    skip : (page-1)*limit,
    where : {
      userId : id
    }
  });

  const total = await prisma.order.count({
    where : {
      userId : id
    }
  });

  return {data, total, page , limit , totalPage : Math.ceil(total/limit)};
}

const getSingleOrder = async(id : string) => {
  // console.log(id);
  const result = await prisma.order.findMany({
    where : {
      id
    }
  })
  // console.log(result);

  return result;
}

const deleteOrder = async(id : string, userId : string) => {
  const result = await prisma.order.delete({
    where : {
      id,
      userId
    }
  })
  return result;
}


export const orderService ={
  createOrder, getAllOrder, getSingleOrder, deleteOrder
}