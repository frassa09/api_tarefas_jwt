import { Router } from "express";
import { usersController } from "../controller/users.controller.js";


export const usersRouter = Router()

usersRouter.post('/register', usersController.registerUser)
usersRouter.post('/login', usersController.loginUser)