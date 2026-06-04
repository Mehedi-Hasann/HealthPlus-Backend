import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { CreateCustomerZodSchema, LoginZodSchema } from "./auth.validation";
import { Role } from "../../generated/enums";
import { auth } from "../../middlewares/auth";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post("/register", multerUpload.single("file") ,validateRequest(CreateCustomerZodSchema), AuthController.registerCustomer);

router.post("/login", AuthController.loginUser);

router.post("/change-password",auth(Role.ADMIN,Role.CUSTOMER,Role.SELLER) ,AuthController.changePassword);

router.post('/logout',auth(Role.ADMIN,Role.CUSTOMER,Role.SELLER),AuthController.logoutUser);

router.post('/verify-email', AuthController.verifyEmail);

router.post("/session-to-token", AuthController.sessionToToken);

export const AuthRoutes: Router = router;