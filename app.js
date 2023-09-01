require('dotenv').config() //Variables de entorno en .ENV

const express = require('express')
const app = express()

const viewsRouter = require('./routes/views.routes')
const usersRouter = require('./routes/users.routes')
const banksRouter = require('./routes/bank.routes')
const checksRouter = require('./routes/checks.routes')
const enterprisesRouter = require('./routes/enterprise.routes')

const cors = require('cors')
const path = require('path')

//Cargar configuracion de plantillas JS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//Middlewares
app.use(express.json())


//Evitar Cors Error
app.use(cors())

//Rutas a usar con mi app express
app.use(viewsRouter, usersRouter, checksRouter, banksRouter, enterprisesRouter)
app.use(express.static('public'))


module.exports = app 

