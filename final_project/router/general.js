const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username&&password) {
    if(!isValid(username)) {
        users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
    
      return res.status(404).json({message: "User already exists!"});    
    }
  } 

  return res.status(404).json({message: "Unable to register user: username or password not provided."});
});

// Get the book list available in the shop
const axios = require('axios');

public_users.get('/', async function (req, res) {
  try {

    const getBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject("Books not found");
        }
      });
    };

    const booksList = await getBooks();


    return res.status(200).send(JSON.stringify(booksList, null, 4));

  } catch (error) {
   
    return res.status(500).json({ message: "Error fetching books list", error: error });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const fetchBookByISBN = (id) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const book = books[id];
            if (book) {
              resolve(book);
            } else {
              reject("Book with this ISBN not found");
            }
          }, 100);
        });
      };
  
      const book = await fetchBookByISBN(isbn);
  
      return res.status(200).send(JSON.stringify(book, null, 4));
  
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const authorName = req.params.author;
  
    try {
      
      const findBooksByAuthor = (author) => {
        return new Promise((resolve, reject) => {
          const keys = Object.keys(books);
          let results = [];
  
          for (let i = 0; i < keys.length; i++) {
            const book = books[keys[i]];
            if (book.author.toLowerCase() === author.toLowerCase()) {
              results.push(book);
            }
          }
  
          if (results.length > 0) {
            resolve(results);
          } else {
            reject("No books found by this author");
          }
        });
      };
 
      const filteredBooks = await findBooksByAuthor(authorName);
  
      return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
  
    try {
    
      const findBooksByTitle = (bookTitle) => {
        return new Promise((resolve, reject) => {
          const keys = Object.keys(books);
         
          const filteredBooks = keys
            .map(key => books[key])
            .filter(book => book.title.toLowerCase() === bookTitle.toLowerCase());
  
          if (filteredBooks.length > 0) {
            resolve(filteredBooks);
          } else {
            reject("No books found with this title");
          }
        });
      };
  
      const results = await findBooksByTitle(title);
       return res.status(200).send(JSON.stringify(results, null, 4));
  
    } catch (error) {
     
      return res.status(404).json({ message: error });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
      return res.status(404).json({ message: "No reviews found: Book not found" });
    }
  });
module.exports.general = public_users;
