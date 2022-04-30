const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Comment = require('../models/comment');

// list articles
router.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render('articles', { articles });
  });
});

// create article form
router.get('/new', (req, res) => {
  res.render('addArticle');
});

// fetch article form
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  // Article.findById(id, (err, article) => {
  //   if (err) return next(err);
  //   res.render('articleDetails', { article });
  // });

  Article.findById(id)
    .populate('comments')
    .exec((err, article) => {
      if (err) return next(err);
      console.log(article);
      res.render('articleDetails', { article });
    });
});

// create article
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

// edit article form
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

// update article
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

// delete article
router.get('/:id/delete', (req, res, next) => {
  const id = req.params.id;
  Article.findByIdAndDelete(id, req.body, (err, article) => {
    if (err) return next(err);
    Comment.remove({ articleId: article.id }, (err) => {
      if (err) return next(err);
      res.redirect('/articles/');
    });
  });
});

// increment likes
router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect('/articles/' + id);
  });
});

router.post('/:articleId/comments', (req, res, next) => {
  const articleId = req.params.articleId;
  console.log(req.body);
  req.body.articleId = articleId;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(articleId, { $push: { comments: comment.id } }, (err, article) => {
      if (err) return next(err);
      res.redirect('/articles/' + articleId);
    });
  });
});

module.exports = router;
