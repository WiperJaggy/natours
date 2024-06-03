const fs =require("fs");
const dotenv = require('dotenv');
const mongoose= require('mongoose');
const Tour = require("../models/tourModel");
const Review = require('../models/reviewModel')
const User = require('../models/userModel')

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));

dotenv.config({ path: './config.env' });

const DB= process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=> console.log("Database Connected"))

///import method to Db
const importData = async () => {
    try{
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log("Data Imported");
    }catch(err){
        console.log(err);
                }
        process.exit();
}
///delete data from DB
const deleteData = async () => {
try{
    await Tour.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    console.log("Data Deleted");
}catch(err){
    console.log(err);
}
process.exit();
}

if(process.argv[2]=='--import'){
    importData();
}else if(process.argv[2]=='--delete'){
    deleteData();
}