const { IssueBook} = require('../Model/bookIssue');
const {Book}=require('../Model/book')
const Fawn=require('fawn');
Fawn.init('mongodb://localhost:27017/STACK-FINANCE-BACKEND')


exports.getissueId = (req, res, next, id) => {
  IssueBook.findById(id)
    .populate("books.book", "name")
    .exec((err, issue) => {
      if (err) {
        return res.status(400).json({
          error: "NO bookissue  found in DB"
        });
      }
      req.issue = issue;
      next();
    });
};



exports.createbookissue =async (req, res) => {
  req.body.user = req.profile;

  let book=await Book.findById(req.body.books)
  if(!book){
    return res.status(500).send('not found')
  }
  
  if(book.stock <= 0){
    return res.status(404).send('stok empty')
  }

  
  const issue = new IssueBook({
    address:req.body.address,
    status:req.body.status,
    user:req.body.user,
    category:req.body.category,
    books:{
      _id:book._id,
      book_name:book.book_name,
      sold:book.sold,
      stock:book.stock,
      author:book.author
    }
  });

 

  try {  
    new Fawn.Task()
      .save('IssueBook', issue)
      .update('Book', { _id: book._id }, { 
        $inc: { stock: -1 ,sold:+1}
      })
      .run();
    res.status(200).send(issue);
  }
  catch(ex) {
 
    res.status(500).send(ex);
  }
 
};


exports.getAllIsuueBook = (req, res) => {
  IssueBook.find()
    .exec((err, iss) => {
      if (err) {
        return res.status(400).json({
          error: "No issue found in DB"
        });
      }
      res.json(iss);
    });
};


exports.getissueBookStatus = (req, res) => {
  // res.json(IssueBook.schema.path("status").enumValues);
  IssueBook.findById(req.params.issueId).then((reg)=>{
    res.send(reg.status)
  }).catch((err)=>{
    res.send(err)
  })
};


exports.updateStatus = async(req, res) => {
  let check_issue=await IssueBook.findById(req.params.issueId)
  if(!check_issue){
    return res.status(500).send('issueid not found')
  }
  IssueBook.findByIdAndUpdate({_id:req.params.issueId},{$set:req.body},{new:true, useFindAndModify: false},(err,update)=>{
      if (err) {
        return res.status(400).json({
          error: "Cannot update  status"
        });
      }
      res.send(update)
  })
};
