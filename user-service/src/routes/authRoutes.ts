import { Router } from "express";
import AuthController from "../controllers/AuthController";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middleware";

const userRouter = Router();

userRouter.post("/register", AuthController.register);
userRouter.post("/login", AuthController.login);
// @ts-ignore
userRouter.get("/users", authMiddleware, UserController.getAllUsers);

export default userRouter;