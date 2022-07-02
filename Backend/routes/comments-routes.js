const express = require('express')

const commentsControllers = require('../controllers/comments')

const router = express.Router()

router.get('/parent/:pid', commentsControllers.getCommentsByParent)
router.get('/post/:pid', commentsControllers.getCommentsByPost)
router.get('/user/:uid', commentsControllers.getCommentByUser)

router.post('/', commentsControllers.createComment)

router.patch('/:cid', commentsControllers.editComment)

router.delete('/:cid', commentsControllers.deleteComment)

module.exports = router;