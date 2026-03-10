const mongoose = require('mongoose');
const {config} = require('./app.config');


const connectDatabase = async () =>{
      try{
            await mongoose.connect(config.MONGODB_URI);
            console.log("Connected to MongoDB");
      }
      catch(err){
            console.error("Error connecting to MongoDB:", err);
            process.exit(1);
      }
     
}

module.exports = { connectDatabase };