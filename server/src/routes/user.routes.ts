import { Router } from "express";
import { getAllUser, signinEmail, signout, signupEmail } from "../controllers/user.controller";
import auth from "../middleware/auth";

const userRouter = Router();

userRouter.post("/signup-email",signupEmail);
userRouter.post("/signin-email",signinEmail);
userRouter.get("/getUsers",auth,getAllUser);
userRouter.get("/logout",auth,signout);

export default userRouter;