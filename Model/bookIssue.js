const mongoose= require('../Dbconnection');
const {bookSchema}=require('../Model/book')
const { ObjectId } = mongoose.Schema;
 


const issueBook =  new mongoose.Schema({
    books:{
      type:bookSchema,
      required:true
    },
    transaction_id: {type:String,default:Math.random(10*3)},
    Fine_amount: { type: Number ,default:0},
    category:{
      type:ObjectId,
      ref:"Category"
    },
    address: String,
    status: {
      type: String,
      required:true,
      enum: ["Cancle", "Pending", "Approved"]
    },
    createdAt : {
      type : Date,
      default : new Date,
      validate : {
      validator : (value) => {
      var str  = value.toLocaleDateString('en-US',{hour12:false,hour : 'numeric',minute:'numeric',second:'numeric'}).split(', ');
      var init = Number(new Date(str[0]));

     if((init + 10 * 60 * 60 * 1000) <= Date.now()  &&  Date.now() <= ( init + 17* 60 * 60 * 1000))
     { 
        
        return true
     }
     return false
    } 
    
  }
  },
    user: {
      type: ObjectId,
      ref: "User"
    }

 
  }
);

const IssueBook = mongoose.model("IssueBook", issueBook,'IssueBook');
module.exports = { IssueBook };
