const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

const app = express();

mongoose.connect('mongodb+srv://briantardif:3a9aiSmQ0nAL1bhJ@cluster0.04zh9ej.mongodb.net/node-angular?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then((response) => console.log('connected to database'))
  .catch((error) => console.error('connection to db failed', error));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/post', postsRoutes);

module.exports = app;
