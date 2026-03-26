import { Router } from "express";
import { authMiddleware } from "../middlewares/authJwtMiddleware.js";
import { tasksController } from "../controller/tasks.controller.js";


export const tasksRouter = Router()

tasksRouter.post('/create', authMiddleware, tasksController.postTask)
tasksRouter.delete('/delete/:taskId', authMiddleware, tasksController.deleteTask)