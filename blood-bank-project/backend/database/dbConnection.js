import mongoose from "mongoose";

export const dbConnection = () =>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "ONLINE_BLOODBANK_MANAGEMENT_SYSTEM"
    }).then(()=>{
        console.log("Connected to the database.")
    }).catch(err=>{
        console.log(`Some error occured while connecting to database: ${err}`)
    })
} 