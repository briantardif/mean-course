const express = require('express')
const multer = require('multer')

const Post = require('../models/post')

const router = express.Router()

const MIME_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPES[file.mimetype]
    let error = new Error('Invalid mime type')
    if (isValid) {
      error = null
    }
    cb(error, 'server/images')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-')
    const ext = MIME_TYPES[file.mimetype]
    cb(null, `${name}-${Date.now()}.${ext}`)
  }
})

router.post('', multer({ storage }).single('image'), (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`
  })
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    })
  })
})

router.put('/:id', multer({ storage }).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath
  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`
    imagePath = `${url}/images/${req.file.filename}`
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath
  })
  console.log(post)
  Post.updateOne({ _id: req.params.id }, post)
    .then(result => {
      res.status(200).json({ message: 'update successful' })
    })
})

router.get('', (req, res, next) => {
  const pageSize = +req.query.pageSize
  const currentPage = +req.query.page
  const postQuery = Post.find()
  let fetchedPosts
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  postQuery
    .then(docs => {
      fetchedPosts = docs
      return Post.count()
        .then(count => {
          res.status(200).json({
            message: 'posts fetched successfully',
            posts: docs,
            totalPosts: count
          })
        })
    })
})

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        console.log(post)
        res.status(200).json({
          message: 'post fetched successfully',
          data: post
        })
      } else {
        res.status(404).json({
          message: 'post not found'
        })
      }
    })
})

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(result => console.log(result))
  res.status(200)
    .json({
      message: 'Post deleted'
    })
})

module.exports = router
