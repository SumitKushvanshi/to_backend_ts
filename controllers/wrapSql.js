import { db } from "../config/sqldb.js";
import SqlString from 'sqlstring';

const SLOW_QUERY_THRESHOLD = 50000;
export const execute = async (query, columnType, queryType) => {

    return new Promise(async (resolve, reject) => {

        let queryToDB = ''
        let start = Date.now()

        try {

            //connection With MSSQL
            let sqlQuery = SqlString.format(query, columnType)

            if (queryType == 5 || queryType == 6) {
                sqlQuery = `${sqlQuery};SELECT CAST(scope_identity()AS int) as insertId;`
            }

            queryToDB = sqlQuery;
            console.log(queryToDB)

            let result = await db.query(sqlQuery)

            let duration = Date.now() - start

            if (duration > SLOW_QUERY_THRESHOLD) {
                await logSLOWQUERYDB(query, duration)
            }


            let resultData = [];

            if (queryType == 1) {
                resultData = result.recordset;//To fetch only one recode

            } else if (queryType == 2) {
                resultData = result.recordsets;//To fetch all users
            } else if (queryType == 3) {
                resultData.affectedRows = result.rowsAffected[0];//update a row
            }else if(queryType==4){
                resultData.affectedRows=result.rowsAffected[0];//Delete A row
            }else if(queryType==5){
                resultData.insertID=result.recordset[0].insertID
            }
            else{
                resultData=result.recordset
            }
            resolve(resultData);


        } catch (error) {
            console.log("This error in the DB",error)
            reject(error)

        }


    })

}