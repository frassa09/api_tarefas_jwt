import { pool } from "../database/db.js"
import generateJwtToken from "../utils/jwtGenerator.js"
import bcrypt from "bcryptjs"


export class User{

    #password

    constructor(name, email, password){
        this.name = name
        this.email = email
        this.#password = password
    }


    static async registerUser(user){

        const { name, email, password } = user

        const hashPassoword = await bcrypt.hash(password.toString(), Number(process.env.SALT_ROUNDS))

        try{

            const responseDb = await pool.query(`INSERT INTO USERS (USERNAME, EMAIL, USER_PASSWORD) VALUES($1, $2, $3) RETURNING *`, [name, email, hashPassoword])

            console.log(`Usuário Registrado: ${responseDb.rows[0]}`)
            return responseDb.rows[0]
        }
        catch(e){

            console.log(`Erro em: ${e}`)
            
            return {
                status: 500,
                error: e
            }
        }
    }

    static async login(email, password){

        try {

            const response = await pool.query(`SELECT * FROM USERS WHERE email LIKE $1`, [email])

            if(response.rowCount == 0){
                console.log('Usuário não encontrado')
                return {
                    status: 404,
                    message: 'Usuário não encontrado'
                }
            }
            console.log(response.rows[0])

            const passwordIsValid = await bcrypt.compare(password.toString(), response.rows[0].user_password)

            if(email == response.rows[0].email && passwordIsValid){

                const payload = {
                    id: response.rows[0].id,
                    name: response.rows[0].name
                }

                const jwtToken = generateJwtToken(payload)

                return {
                    status: 200,
                    token: jwtToken,
                    message: 'Login realizado com sucesso'
                }
            }
        }
        catch(e){

            console.log(`Erro em: ${e}`)

            return {
                status: 500,
                error: e
            }
        }
    }
}