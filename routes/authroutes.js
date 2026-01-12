import express from 'express'
 const routes=express.Router()
import {login, logoutUser, register} from '../controllers/authuser.js'
import { addTask ,deleteData,listTask,searchApi,updateData} from '../controllers/taskcontrol.js'
import { middelWare } from '../controllers/authuser.js'


routes.post('/register',register)
routes.post('/login',login)
routes.post('/addtask',middelWare,addTask)
routes.put('/updatetask/:id',updateData)
routes.get('/listTask',middelWare,listTask)
routes.put('/delete/:id',deleteData)
routes.post('/logout',logoutUser)
routes.get('/search',searchApi)


export default routes




 