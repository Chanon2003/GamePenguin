import { Router } from "express";
import { getAllUser, refreshToken, signinEmail, signout, signupEmail } from "../controllers/user.controller";
import auth from "../middleware/auth";

const userRouter = Router();

userRouter.post("/signup-email",signupEmail);
userRouter.post("/signin-email",signinEmail);
userRouter.get("/getUsers",auth,getAllUser);
userRouter.get("/logout",auth,signout);
userRouter.post("/refresh-token",auth,refreshToken);

export default userRouter;