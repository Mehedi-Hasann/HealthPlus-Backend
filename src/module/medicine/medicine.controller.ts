import { Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getMedicineById = catchAsync(
  async (req: Request, res : Response) => {
    const result = await medicineService.getMedicineById(req.params.id as string);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Medicine fetched successfully",
      data : result
    })
  }
)

const getAllMedicine = catchAsync(
  async (req: Request, res : Response) => {
     const {search} = req.query;
    const searchString = typeof search==="string" ? search : undefined;
    const {sortBetweenPrice} = req.query;
    // console.log("Sort by",sortBetweenPrice);

    const {price} = req.query;
    const priceString = typeof price==='string' ? price : undefined;

    const {category} = req.query;
    const categoryString = typeof category==='string' ? category : undefined

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;

    const sortBy = (req.query.sortBy ?? "price") as string | undefined;
    const sortOrder = (req.query.sortBetweenPrice ?? "asc") as string | undefined;
    // console.log({search, category, price});
    
    const result = await medicineService.getAllMedicine({search : searchString, price : priceString, category: categoryString, page, limit, sortBy, sortOrder});
    
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Medicine fetched successfully",
      data : result
    })   
  }
)


export const medicineController = {
  getMedicineById, getAllMedicine
}