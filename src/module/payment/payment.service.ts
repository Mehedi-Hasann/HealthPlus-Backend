/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus, OrderStatus } from "../../generated/client";

const handlerStripeWebhookEvent = async (userId: string,event: Stripe.Event) => {
    const existingPayment = await prisma.payment.findFirst({
        where : {
            stripeEventId : event.id
        }
    })

    if(existingPayment){
        return { message: `Event ${event.id} already processed`};
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;

            const orderId = session.metadata?.orderId;
            const paymentId = session.metadata?.paymentId;

            if( !orderId || !paymentId ) {
                console.error("Missing orderId or paymentId in session metadata");
                return { message: "Missing orderId or paymentId in session metadata" };
            }

            const order = await prisma.order.findUnique({
                where : {
                    id : orderId
                }
            })

            if (!order) {
                console.error(`Order with ID ${orderId} not found`);
                return { message: `Order with ID ${orderId} not found` };
            }


            await prisma.$transaction(async (tx) => {
                await tx.payment.update({
                    where : {
                        id : paymentId
                    },
                    data : {
                        status : session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
                        stripeEventId : event.id
                    }
                })
                const orderData = await tx.order.update({
                    where : {
                        id : orderId
                    },
                    data : {
                        paymentStatus : session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
                        orderStatus : OrderStatus.CONFIRMED
                    }
                })



                await tx.cart.deleteMany({
                    where : {
                        medicineId : orderData.medicineId,
                        userId : orderData.userId
                    }
                })
            })
            console.log(`Processed checkout.session.completed for appointment ${orderId} and payment ${paymentId}`);
            
            break;

        }

        case "checkout.session.expired": {
                const session = event.data.object;
                console.log(`Checkout session ${session.id} expired. Marking associated payment as failed.`);
                break;
        }
        case "payment_intent.payment_failed": {
            const session = event.data.object;
            console.log(`Payment intent ${session.id} failed. Marking associated payment as failed.`);
            break;
        }
        default:
            return { message: `Unhandled event type: ${event.type}` };
    }
};

export const PaymentService = {
    handlerStripeWebhookEvent
}