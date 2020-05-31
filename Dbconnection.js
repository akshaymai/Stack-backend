const mongoose=require('mongoose')
require("dotenv").config();
mongoose.Promise=global.Promise;

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  }).catch(()=>{
      console.log("DB NOT CONNECTED")
  });


  module.exports=mongoose