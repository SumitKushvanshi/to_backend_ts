import { db } from "../config/sqldb.js";
import sql from 'mssql'

export const addTask = async (req, res) => {
    const user_id = req.user.id;
    if (user_id === null) {
        return res.status(400).json({
            message: "User Are not login ",
            success: false
        })
    }
    console.log(user_id)
    try {
        const { task, description } = req.body;
        console.log(task, description)
        if (!task || !description) {
            return res.status(400).send({
                message: "Fill the all fields",
                success: false
            })
        }
        const result = await db
            .request()
            .input("user_id", sql.Int, user_id)
            .input("task", sql.VarChar, task)
            .input("description", sql.VarChar, description)
            .query(`
    INSERT INTO task (user_id, task, description)
    VALUES (@user_id, @task, @description)
  `);
        return res.status(201).json({
            message: "Task Add Successfull",
            success: true,
            data: result
        })
    } catch (error) {
        res.status(500).send({ message: "Server side Error", success: false, error }

        )

    }
}



export const updateData = async (req, res) => {
    try {
        const id = req.params.id
        const { task, description } = req.body
        console.log(task, description, id)

        if (!task || !description) {
            return res.status(400).send({ message: "Data is not found for update", success: false })
        }
        const result = await db.query('UPDATE task SET task=?,description=? WHERE id=?', [task, description, id]

        )
        res.status(200).json({
            message: "Task Update Successfully",
            success: true,
            result
        })

    } catch (error) {
        res.status(300).send({ message: 'Server side error', success: true })

    }
}



export const listTask = async (req, res) => {
    const user_id = req.user.id;


    try {
        const result = await db.query`SELECT * FROM task WHERE user_id = ${user_id}  AND isDeleted = 0`;







        if (result.recordset.length > 0) {
            return res.status(200).json({
                message: "Task is find",
                success: true,
                result
            })
        }

    } catch (error) {
        res.status(500).send({ message: "ServerSide Error", success: false, })
    }
}

export const deleteData = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const [result] = await db.query('UPDATE task SET isDeleted=true WHERE id=? ', [id])



        res.status(200).json({
            message: "Task is Deleted",
            success: true,
            result
        })



    } catch (error) {
        res.status(500).send({ message: "Server side Error", success: false, error })
    }
}


export const searchApi = async (req, res) => {

    const data = req.query.data;


    try {

        const result = await db
            .request()
            .input('search', sql.VarChar, `%${data}%`)
            .query(`SELECT task FROM task  WHERE     task LIKE @search `);



        if (result.recordset.length <= 0) {
            return res.status(404).json({
                message: "Data Not found",
                success: true
            })
        }
        return res.status(200).json({
            message: "Data Search by user",
            success: true,
            result

        })

    } catch (error) {
        return res.status(500).json({
            message: "Server is Not working",
            success: false
        })

    }

}