const app = require('./app');

const port = process.env.MONGO_PORT
const dbURL = process.env.MONGO_DB_URL

const mongoose = require('mongoose') 

mongoose.connect(dbURL)
                    .then(() =>{ 
                        console.log(`\x1b[35m Conectado a MongoDB\x1b[37m`)

                        app.listen(port, ()=>{ 
                            
                            console.log(`\x1b[36m Servidor corriendo en puerto: ${port} \x1b[37m`)
                        }) 

                    }).catch(function(error){ 
                        console.log(error)
                    })
