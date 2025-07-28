import { Router } from "express";
import { getAllUser, signinEmail, signout, signupEmail } from "../controllers/user.controller";
import auth from "../middleware/auth";
import generatedRefreshToken from "../utils/generatedRefreshToken";

const userRouter = Router();

userRouter.post("/signup-email",signupEmail);
userRouter.post("/signin-email",signinEmail);
userRouter.get("/getUsers",auth,getAllUser);
userRouter.get("/logout",auth,signout);
userRouter.post("/refresh-token",auth,generatedRefreshToken);

export default userRouter;