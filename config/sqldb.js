// import sql from 'mssql'

//     export const db=await sql.ConnectionPool({
//         Server:process.env.SERVER,
//         User:process.env.USER,
//         password:process.env.PWD,
//         database:process.env.DB_NAME
//     });

//    console.log("Database is connected Successfully")

import sql from "mssql";

export const db = await sql.connect({
  user: process.env.USER,
  password: process.env.PWD,
  server: process.env.SERVER,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
  },
});
 
console.log("Database connected successfully");

