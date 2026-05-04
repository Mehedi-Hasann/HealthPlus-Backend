import { Request, Response } from "express";
import { sellerServices } from "./seller.service";
import { Medicine, Order } from "../../generated/client";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";


const createMedicine = catchAsync(async(req: Request, res : Response) => {
  if(req.body.data){
    req.body = JSON.parse(req.body.data);
  }
  const name = req.body.name;
  const categoryName = req.body.categoryName;
  const price = Number(req.body.price);
  const stock = Number(req.body.stock);
  const payload = {
    name,
    categoryName,
    price,
    stock,
    image : req.file?.path || null
  }
  console.log(payload);

  const result = await sellerServices.createMedicine(payload);

  sendResponse(res, {
    httpStatusCode : status.OK,
    success : true,
    message : "Medicine created successfully",
    data : result
  })
})

const updateMedicine = catchAsync(async(req: Request, res : Response) => {
  const {id} = req.params;
  const result = await sellerServices.updateMedicine(req.body as Medicine, id as string);

  sendResponse(res, {
    httpStatusCode : status.OK,
    success : true,
    message : "Medicine updated successfully",
    data : result
  })
})

const deleteMedicine = catchAsync( async(req: Request, res : Response) => {
  const {id} = req.params;
  const result = await sellerServices.deleteMedicine(id as string);

  sendResponse(res, {
    httpStatusCode : status.OK,
    success : true,
    message : "Medicine deleted successfully",
    data : result
  })
})

const getAllOrder = catchAsync(async(req: Request, res : Response) => {
  const result = await sellerServices.getAllOrder();

  sendResponse(res, {
    httpStatusCode : status.OK,
    success : true,
    message : "All orders fetched successfully",
    data : result
  })
})

const updateStatus = catchAsync(async(req: Request, res : Response) => {
  const id = req.params.id;
  const result = await sellerServices.updateStatus(req.body as Order, id as string);

  sendResponse(res, {
    httpStatusCode : status.OK,
    success : true,
    message : "Order status updated successfully",
    data : result
  })
})

export const sellerController = {
  createMedicine, updateMedicine, deleteMedicine, getAllOrder, updateStatus
}