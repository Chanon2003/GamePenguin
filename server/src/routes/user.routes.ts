import { Router } from "express";
import { changeRole, getAllUser, getUserById, refreshToken, signinEmail, signout, signupEmail } from "../controllers/user.controller";
import {auth, authAdmin} from "../middleware/auth";

const userRouter = Router();

userRouter.post("/signup-email",signupEmail);
userRouter.post("/signin-email",signinEmail);
userRouter.get("/getusers",auth,getAllUser);
userRouter.get("/getuser/:id",getUserById);
userRouter.get("/logout",auth,signout);
userRouter.post("/refresh-token",auth,refreshToken);
userRouter.put("/change-role",auth,changeRole);

export default userRouter;