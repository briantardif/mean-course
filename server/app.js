const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/post', (req, res, next) => {
  const posts = req.body;
  console.log(posts);

  res.status(201).json({
    message: 'post added successfully'
  })
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'fwoeifwe',
      title: 'first server side post',
      content: 'this is coming from the server'
    },
    {
      id: 'fwefowne',
      title: 'second server side post',
      content: 'this is coming from the server'
    }
  ]
  res.status(200).json({
    message: 'posts fetched successfully',
    posts: posts
  });
})

module.exports = app;
