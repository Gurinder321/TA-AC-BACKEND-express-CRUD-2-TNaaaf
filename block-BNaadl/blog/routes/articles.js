const express = require('express');
const router = express.Router();
const Article = require('../models/article');

router.get('/', (req, res) => {
  // fetch list of books from database
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render('articles', { articles });
  });
});

router.get('/new', (req, res) => {
  res.render('addArticle');
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Article.findById(id, (err, article) => {
    console.log(article);
    if (err) return next(err);
    res.render('articleDetails', { article: article });
  });
});

router.post('/', (req, res, next) => {
  // capture data

  req.body.tags = req.body.tags.split(' ');
  // save it to the database
  Article.create(req.body, (err, createdArticle) => {
    if (err) return next(err);
    res.redirect('/articles');
  });
  //   response
});

router.get('/:id/edit', (req, res, next) => {
  // find the book details
  const id = req.params.id;
  Article.findById(id, (err, article) => {
    article.tags = article.tags.join(' ');
    if (err) return next(err);
    res.render('editArticleForm', { article });
  });
  // render update form
});

router.post('/:id', (req, res, next) => {
  // capture the updated data from form
  const id = req.params.id;
  req.body.tags = req.body.tags.split(' ');
  // using id find the book and update it with data coming from the form
  Article.findByIdAndUpdate(id, req.body, (err, updatedData) => {
    if (err) return next(err);
    res.redirect('/articles/' + id);
  });
});

router.get('/:id/delete', (req, res, next) => {
  const id = req.params.id;
  Article.findByIdAndDelete(id, req.body, (err, article) => {
    if (err) return next(err);
    res.redirect('/articles/');
  });
});

// increment likes
router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, { likes: { $inc: 1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect('/articles/' + id);
  });
});

module.exports = router;
