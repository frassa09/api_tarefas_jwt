import { Task } from "../model/tasks.model.js"


export const tasksController = {

    postTask: async (req, res) => {

        const { title, description, completed } = req.body
        const userId = req.userId

        if(!title || !description){
            return res.status(404).json({ status: 404, message: 'O body não foi preenchido corretamente'})
        }

        const task = new Task({
            title,
            description,
            completed,
            userId
        })

        const response = await task.createTask()

        return res.json(response)
    },

    deleteTask: async (req, res) => {

        const { taskId } = req.params
        const userId = req.userId

        const response = await Task.deleteTask(taskId, userId) 

        return res.json(response)
    }
}