import { User } from "../model/users.model.js"


export const usersController = {

    registerUser: async (req, res) => {

        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(401).json({ error: 'O formulário foi preenchido incorretamente' })
        }

        const user = {
            name,
            email,
            password
        }

        const response = await User.registerUser(user)

        return res.json(response)
    },

    loginUser: async (req, res) => {

        const {email, password } = req.body

        if(!email || !password){
            return res.status(401).json({error: 'O formulário foi preenchido incorretamente'})
        }

        const response = await User.login(email, password)

        return res.json(response)
    }
}