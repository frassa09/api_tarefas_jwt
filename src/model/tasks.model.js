import { pool } from "../database/db.js"


export class Task{

    constructor({title, description, completed = false, userId}){
        this.title = title
        this.description = description
        this.completed = completed,
        this.userId = userId
    }

    async createTask(){

        try{

            const response = await pool.query(`INSERT INTO TASKS(TITLE, TASK_DESCRIPTION, COMPLETED, USER_ID) VALUES ($1, $2, $3, $4)`,
                [this.title, this.description, this.completed, this.userId]
            )

            console.log(`Tarefa criada com sucesso: ${response.rows[0]}`)

            return {
                status: 200,
                message: response.rows[0]
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

    static async deleteTask(idTask, idUser){

        try {

            const response = await pool.query(`DELETE FROM TASKS WHERE ID = $1 AND USER_ID = $2 RETURNING *`, [idTask, idUser])

            if(response.rowCount == 0){
                return {
                    status: 404,
                    message: 'Tarefa não encontrada'
                }
            }


            console.log(`Tarefa deletada com sucesso: ${response.rows[0]}`)

            return {
                status: 200,
                message: `Tarefa deletada com sucesso: ${response.rows[0]}`
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