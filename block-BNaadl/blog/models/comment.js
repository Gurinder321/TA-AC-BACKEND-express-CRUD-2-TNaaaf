const mongoose = require('mongoose');
mongoose.models = {}; // FIXME: Added this line and it worked..??
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    text: { type: String, required: true },
    articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    author: String,
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
