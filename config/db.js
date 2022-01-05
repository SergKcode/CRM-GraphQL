const mongoose = require('mongoose');
require('dotenv').config({path:'variables.env'})

const connectDB =async () =>{
    try{
        await mongoose.connect( process.env.DB_MONGO, {
            useNewUrlParser:true,
            useUnifiedTopology:true,
           /*  useFindAndModify:false,
            useCreateIndex:true */

        })
        console.log('DB working') 

    }catch (error){
        console.log('error connecting DB')
        console.log(error)
        process.exit(1) //stop APP

    }
}

module.exports = connectDB

