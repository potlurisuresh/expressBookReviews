const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


function getBooks(){
    return new Promise((resolve, reject) => {
      resolve(books);
})
}

function getByISBN(isbn){
    return new Promise((resolve, reject) => {
     if(books[isbn]){
      resolve(books[isbn]);
    }else{
        reject({status:404, message:'ISBN ${isbn} not found}'})
    }})
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
  //Write your code here
  //return res.send(JSON.stringify(books,null, 4));
//});
public_users.get('/', async function(req, res) {
    try{
       const bks = await getBooks();
       res.send(JSON.stringify(bks));
       } catch(error){
       console.error(error);
       res.status(500).send('Internal Server Error');
}});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //const isbn = req.params.isbn;
  //return res.send(books[isbn]);
  getByISBN(req.params.isbn)
  .then(
   result => res.send(result),
   error => res.status(error.status).json({message: error.message}));

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  //let filtered_books = books.filter((book) => book.author === author);
  
//   //for (const index in books ) {
//     console.log(JSON.stringify(books[index],null,4));
//     book = books[index];
//     if ( book.author == author)  {
//         console.log("Book with Auhtor"+ (' ') + (author) +" Has been found");
//         return res.send(JSON.stringify(book,null,4));
//     }
//   }
//    return res.status(300).json({message: "Book with Given author"+(' ')+ (author) +" not found"});
    getBooks()
      .then((bookEntries) => Object.values(bookEntries))
      .then((books) => books.filter((book) => book.author === author))
      .then((filteredBooks) => res.send(filteredBooks));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  
//   for (const index in books ) {
//     console.log(JSON.stringify(books[index],null,4));
//     book = books[index];
//     if ( book.title == title)
//     {
//         console.log("Book with Title"+ (' ') + (title) +" Has been found");
//         return res.send(JSON.stringify(book,null,4));
//     }
//   }
//   return res.status(300).json({message: "Book with Given title"+(' ')+ (title) +" not found"});
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const risbn = req.params.isbn;
  console.log(risbn); 
  console.log(JSON.stringify(books[risbn],null,4));
  book = books[risbn];

  return res.send(JSON.stringify(book.reviews,null,4));

  //return res.status(300).json({message: "No found "});
});

module.exports.general = public_users;
