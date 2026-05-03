import { Request, Response } from "express";
import { sellerServices } from "./seller.service";
import { Medicine, Order } from "../../generated/client";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";


const createMedicine = catchAsync(async(req: Request, res : Response) => {
  try {

    if(req.body.data){
      req.body = JSON.parse(req.body.data);
    }
    const payload = {
      ...req.body,
      image : req.file?.path
    }
    // console.log(payload);

    const result = await sellerServices.createMedicine(payload);
    // console.log(result);

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Medicine created successfully",
      data : result
    })
  } catch (error : any) {
    // console.log(error);
    sendResponse(res, {
      httpStatusCode : status.BAD_REQUEST,
      success : false,
      message : "Error creating medicine"
    })
  }
})

const updateMedicine = catchAsync(async(req: Request, res : Response) => {
  try {
    const {id} = req.params;
    const result = await sellerServices.updateMedicine(req.body as Medicine, id as string);

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Medicine updated successfully",
      data : result
    })
  } catch (error : any) {
    sendResponse(res, {
      httpStatusCode : status.BAD_REQUEST,
      success : false,
      message : "Error updating medicine"
    })
  }
})

const deleteMedicine = catchAsync( async(req: Request, res : Response) => {
  try {
    const {id} = req.params;
    const result = await sellerServices.deleteMedicine(id as string);

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Medicine deleted successfully",
      data : result
    })
  } catch (error : any) {
    sendResponse(res, {
      httpStatusCode : status.BAD_REQUEST,
      success : false,
      message : "Error deleting medicine"
    })
  }
})

const getAllOrder = catchAsync(async(req: Request, res : Response) => {
  try {
    const result = await sellerServices.getAllOrder();

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "All orders fetched successfully",
      data : result
    })
  } catch (error : any) {
    sendResponse(res, {
      httpStatusCode : status.BAD_REQUEST,
      success : false,
      message : "Error fetching all orders"
    })
  }
})

const updateStatus = catchAsync(async(req: Request, res : Response) => {
  try {
    const id = req.params.id;
    const result = await sellerServices.updateStatus(req.body as Order,id as string);

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Order status updated successfully",
      data : result
    })
  } catch (error : any) {
    sendResponse(res, {
      httpStatusCode : status.BAD_REQUEST,
      success : false,
      message : "Error updating order status"
    })
  }
})

export const sellerController = {
  createMedicine, updateMedicine, deleteMedicine, getAllOrder, updateStatus
}