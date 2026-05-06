import express, { Router } from "express"
import { customerController } from "./customer.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../generated/enums";
import { createAddressZodSchema, createReviewZodSchema } from "./customer.validation";
import { validateRequest } from "../../middlewares/validateRequest";
const router = express.Router();

router.get('/me',auth(Role.CUSTOMER,Role.ADMIN,Role.SELLER),customerController.getMyProfile);
router.get('/orders',auth(Role.CUSTOMER),customerController.getMyOrder);
router.get('/orders/:id',auth(Role.CUSTOMER),customerController.getSingleOrder);

router.post('/cart',auth(Role.CUSTOMER),customerController.AddItemToCard);
router.post('/decrement',auth(Role.CUSTOMER),customerController.DecrementCartItem);

router.get('/cart',auth(Role.CUSTOMER),customerController.getMyCartItem);
router.get('/cart/:id',auth(Role.CUSTOMER),customerController.getMySingleCartItem);
router.put('/profile',auth(Role.CUSTOMER, Role.SELLER),customerController.editMyProfile);
router.put('/checkout',auth(Role.CUSTOMER),customerController.addShippingAddress);
router.delete('/:id',auth(Role.CUSTOMER),customerController.deleteCartItem);

router.post('/address',validateRequest(createAddressZodSchema),auth(Role.CUSTOMER),customerController.createAddress);
router.put('/update-my-address',auth(Role.CUSTOMER,Role.SELLER),customerController.updateAddress);


router.post('/review',auth(Role.CUSTOMER),validateRequest(createReviewZodSchema),customerController.createReview);


router.get('/review',auth(Role.CUSTOMER,Role.ADMIN,Role.SELLER),customerController.getReview);
router.get('/review/:medicineId',auth(Role.CUSTOMER,Role.ADMIN,Role.SELLER),customerController.getSingleMedicineReview);                    
router.get('/my-address',auth(Role.CUSTOMER),customerController.getMyAddress);



export const customerRouter: Router = router