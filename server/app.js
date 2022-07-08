const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

//
mongoose.connect('mongodb+srv://briantardif:3a9aiSmQ0nAL1bhJ@cluster0.04zh9ej.mongodb.net/node-angular?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then((response) => console.log('connected to database'))
  .catch((error) => console.error('connection to db failed', error));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/post', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(result => {
    res.status(201).json({
      message: 'post added successfully',
      postId: result._id
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(docs => {
      res.status(200).json({
        message: 'posts fetched successfully',
        posts: docs
      });
    })
});

app.delete('/api/post/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result => console.log(result));
  res.status(200)
    .json({
      message: 'Post deleted'
    })
});

module.exports = app;
