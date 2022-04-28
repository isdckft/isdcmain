var mongoose = require('mongoose');

var Article = mongoose.model('Article', {
  author: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }, 
  desc: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  url: {
    type: String,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Article};
