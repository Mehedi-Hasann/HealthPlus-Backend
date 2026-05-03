import express, { Router } from "express";
import { sellerController } from "./seller.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../generated/enums";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.post("/medicines",auth(Role.SELLER, Role.ADMIN),multerUpload.single("file") ,sellerController.createMedicine);
router.put("/medicines/:id",auth(Role.SELLER,Role.ADMIN),sellerController.updateMedicine);
router.delete("/medicines/:id",auth(Role.SELLER,Role.ADMIN),sellerController.deleteMedicine);
router.get("/orders",auth(Role.SELLER,Role.ADMIN),sellerController.getAllOrder);
router.patch("/orders/:id",auth(Role.SELLER, Role.ADMIN),sellerController.updateStatus);

export const sellerRouter: Router = router