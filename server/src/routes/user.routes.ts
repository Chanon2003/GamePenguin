import { Router } from "express";
import { getAllUser, signupEmail } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/signup-email",signupEmail);
userRouter.get("/getUsers",getAllUser);

export default userRouter;