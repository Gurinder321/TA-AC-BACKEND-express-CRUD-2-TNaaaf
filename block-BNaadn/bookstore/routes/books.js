const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Comment = require('../models/comment');

router.get('/', (req, res) => {
  // fetch list of books from database
  Book.find({}, (err, books) => {
    if (err) return next(err);
    res.render('books', { books: books });
  });
});

router.get('/new', (req, res) => {
  res.render('addBook');
});

// create book
router.post('/', (req, res, next) => {
  // capture data

  // save it to the database
  Book.create(req.body, (err, createdBook) => {
    if (err) return next(err);
    res.redirect('/books');
  });
  //   response
});

// get book details page
// router.get('/:id', (req, res, next) => {
//   const id = req.params.id;
//   Book.findById(id, (err, book) => {
//     if (err) return next(err);
//     res.render('bookDetails', { book: book });
//   });
// });

// Book.find()
//   .sort({ insertedAt: 1 })
//   .limit(10)
//   .exec((err, result) => {});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Book.findById(id)
    .populate('comments')
    .exec((err, book) => {
      if (err) return next(err);
      res.render('bookDetails', { book });
    });
});

// edit book form
router.get('/:id/edit', (req, res, next) => {
  // find the book details
  const id = req.params.id;
  Book.findById(id, (err, book) => {
    if (err) return next(err);
    res.render('editBookForm', { book: book });
  });
  // render update form
});

router.post('/:id', (req, res) => {
  // capture the updated data from form
  const id = req.params.id;
  // using id find the book and update it with data coming from the form
  Book.findByIdAndUpdate(id, req.body, (err, updatedBook) => {
    if (err) return next(err);
    res.redirect('/books/' + id);
  });
});

router.get('/:id/delete', (req, res, next) => {
  Book.findByIdAndDelete(req.params.id, (err, book) => {
    if (err) return next(err);
    Comment.deleteMany({ bookId: book.id }, (err, info) => {
      res.redirect('/books');
    });
  });
});

// create a comment
router.post('/:id/comments', (req, res, next) => {
  const id = req.params.id;
  req.body.bookId = id;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    // update book with comment id into comment section
    Book.findByIdAndUpdate(id, { $push: { comments: comment._id } }, (err, updatedBook) => {
      if (err) return next(err);
      res.redirect('/books/' + id);
    });
  });
});

module.exports = router;
