import { Request, Response } from "express";
import { customerService } from "./customer.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getMyProfile = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    console.log("From customer controller ",req.user);
    console.log(id);
    const result = await customerService.getMyProfile(id);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Profile fetched successfully",
      data : result
    })
  }
)

const getMyOrder = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.getMyOrder(id);
    console.log(result);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Orders fetched successfully",
      data : result
    })
  }
)

const editMyProfile = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.editMyProfile(req.body ,id);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Profile updated successfully",
      data : result
    })
  }
)

const getSingleOrder = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.params;
    const result = await customerService.getSingleOrder(id as string);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Order fetched successfully",
      data : result
    })
  }
)

const addShippingAddress = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.addShippingAddress(req.body ,id);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Shipping address added successfully",
      data : result
    })
  }
)

const AddItemToCard = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.AddItemToCard(req.body ,id);
    console.log(result)
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Item added to cart successfully",
      data : result
    })
  }
)

const DecrementCartItem = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.DecrementCartItem(req.body ,id);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Cart item decremented successfully",
      data : result
    })
  }
)

const getMyCartItem = catchAsync(
  async(req: Request, res: Response) => {
    console.log(req.user)
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const userId = req.user.id;
    const result = await customerService.getMyCartItem(userId);
    console.log(result);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Cart items fetched successfully",
      data : result
    })
  }
)

const getMySingleCartItem = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.params;
    const result = await customerService.getMySingleCartItem(id as string);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Cart item fetched successfully",
      data : result
    })
  }
)

const deleteCartItem = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.params;
    const result = await customerService.deleteCartItem(id as string);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Cart item deleted successfully",
      data : result
    })
  }
)

const createAddress = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.createAddress(req.body ,id);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Address added successfully",
      data : result
    })
  }
)

const getMyAddress = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.getMyAddress(id);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Address fetched successfully",
      data : result
    })
  }
)

const updateAddress = catchAsync(
  async(req: Request, res: Response) => {
    console.log('hi');
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.updateAddress(req.body ,id);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Profile updated successfully",
      data : result
    })
  }
)

const createReview = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.createReview(req.body ,id);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Review added successfully",
      data : result
    })
  }
)

const getReview = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.getReview(id);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Review fetched successfully",
      data : result
    })
  }
)

const getSingleMedicineReview = catchAsync(
  async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.getSingleMedicineReview(id);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Review fetched successfully",
      data : result
    })
  }
)

export const customerController = {
  getMyProfile, getMyOrder, editMyProfile, getSingleOrder, addShippingAddress, AddItemToCard,getMyCartItem, getMySingleCartItem, DecrementCartItem, deleteCartItem, createAddress,updateAddress, getMyAddress, createReview, getReview, getSingleMedicineReview
}