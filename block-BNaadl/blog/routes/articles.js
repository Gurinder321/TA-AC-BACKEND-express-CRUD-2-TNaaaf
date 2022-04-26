var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  // fetch list of books from database
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render('articles', { articles: articles });
  });
});

module.exports = router;
