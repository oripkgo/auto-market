const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');

router.get('/free', postController.getAllPosts);
router.get('/free/:id', postController.getPostById);
router.post('/free', postController.createPost);
router.put('/free/:id', postController.updatePost);
router.delete('/free/:id', postController.deletePost);

router.get('/inquiry', postController.getAllPosts);
router.get('/inquiry/:id', postController.getPostById);
router.post('/inquiry', postController.createPost);
router.put('/inquiry/:id', postController.updatePost);
router.delete('/inquiry/:id', postController.deletePost);


router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
