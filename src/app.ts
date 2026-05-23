import express, { Application, Request, Response } from "express";
import { medicineRouter } from "./module/medicine/medicine.route";
import { categoryRoute } from "./module/category/category.route";
import cors from "cors"
import { sellerRouter } from "./module/seller/seller.route";
import { orderRoute } from "./module/orders/orders.route";
import { adminRoute } from "./module/admin/admin.route";
import { customerRouter } from "./module/customer/customer.route";
import cookieParser from "cookie-parser";
import paymentRoute from "./module/payment/payment.route";
import { PaymentController } from "./module/payment/payment.controller";
import { envVars } from "./config/env";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { AuthRoutes } from "./module/auth/auth.route";
import { multerUpload } from "./config/multer.config";

const app : Application= express();




app.use(cors({
  origin : [envVars.APP_URL, envVars.FRONTEND_URL],
  credentials : true
}))







app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent)

app.all('/api/auth/*splat',multerUpload.single("file"),toNodeHandler(auth));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use("/api/payment", paymentRoute);
app.use("/auth",AuthRoutes)

//! customer
app.use("/api/customer",customerRouter);

//! medicine
app.use("/api/categories",categoryRoute);
app.use("/api/medicines",medicineRouter);

//! seller
app.use("/api/seller",sellerRouter);

//! orders
app.use("/api/orders",orderRoute);

//! admin
app.use("/api/admin",adminRoute);

app.get("/", (req: Request,res: Response) => {
  res.send("Hello World !!");
})

app.use(globalErrorHandler);
app.use(notFoundHandler)


export default app