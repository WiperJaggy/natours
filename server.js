/* eslint-disable prettier/prettier */
const dotenv = require('dotenv');
const mongoose= require('mongoose');

process.on('uncaughtException',err =>{
    console.log('Uncaught Exception shutting down...🎇')
    console.log(err.name , err.message);
        process.exit(1);
    })  

dotenv.config({ path: './config.env' });
const app = require('./app');
const DB= process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=> console.log("Database Connected"))

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
   console.log(`App running on Port ${port}`);
})
process.on('unhandledRejection',err => {
    console.log(err.name , err.message);
    console.log('Unhandled Rejection shutting down...🎇')
    server.close(() => {
        process.exit(1);
    })
})