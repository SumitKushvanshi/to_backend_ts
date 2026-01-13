
import { db } from '../config/sqldb.js'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import sql from "mssql";
import { execute } from './wrapSql.js';
import type from '../healper/queryType.js';





export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Check email
        const checkEmail = await db.query`
      SELECT TOP(1) * FROM registerUser WHERE email = ${email}
    `;

        if (checkEmail.recordset.length > 0) {
            return res.status(409).json({
                message: "Email already exists",
                success: false,
            });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        // Insert user
        await db
            .request()
            .input("name", sql.VarChar, name)
            .input("email", sql.VarChar, email)
            .input("password_hash", sql.VarChar, hashPassword)
            .query(`
        INSERT INTO registerUser (name, email, password)
        VALUES (@name, @email, @password_hash)
      `);

        return res.status(201).json({
            message: "User created successfully",
            success: true,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return (
                res.status(400).json({
                    message: "Fill the All fields",
                    success: false
                })
            )
        }
        const result = await db.query` SELECT TOP(1) * FROM registerUser WHERE email = ${email}`;



        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: "User is Not Found",
                success: false
            })
        }


        const user = result.recordset[0];
        const comparePassword = await bcrypt.compare(password, user.password,)
        if (!comparePassword) {
            return res.status(400).send({
                message: 'Username and password is Invalid',
                success: false
            })
        }
        const payload = {
            id: user.user_id,
            email: user.email

        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '15d' })

        res.cookie("token", token, { httpOnly: true });
        return res.status(200).send({
            message: 'User is Verified',
            success: true,
            token,
            email,

        })


    } catch (error) {
        res.status(500).send({
            message: 'Internal Server Error',
            success: false,
            error: error
        })

    }
}



export const logoutUser = async (req, res) => {


    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }

}


export const getUserDetail = async (req, res) => {
    try {

        const user = await db.query` SELECT TOP(1) * FROM registerUser WHERE email = ${email}`

    } catch (error) {

        return res.status(500).json({
            message: "Serevr side error",
            success: false,
            error
        })

    }
}


export const middelWare = (req, res, next) => {

    try {
        const token = req.cookies.token;
        console.log(token)
        if (!token) {
            return res.status(400).send({ message: "User token is not verified", success: false })
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded;

        next()


    } catch (error) {
        res.status(500).send({ message: "Server side error", success: false, error })

    }


}


const query = 'SELECT  * FROM registerUser  '
// const columnType = ['email']

export const getData = async (req, res) => {
  try {
     const data= await execute(query, [], type.SELECT_MULTI)

   res.send({
    message:"Sab kuch sahi h",
    success:true,
    data
   })

  } catch (error) {
    res.status(500).json({
        message:"Server side error",
        success:false,
        
    })
    
  }
}