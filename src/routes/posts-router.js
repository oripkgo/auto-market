const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');
const setCategory = require('../middleware/setting-category');
const checkUserRole = require('../middleware/role-check-middleware');

router.get('/free', setCategory("free"), postController.getAllPosts);
router.get('/free/:id', setCategory("free"), postController.getPostById);
router.post('/free/', setCategory("free"), postController.createPost);
router.put('/free/', setCategory("free"), postController.updatePost);
router.delete('/free/:id', setCategory("free"), postController.deletePost);

router.get('/inquiry', setCategory("inquiry"), postController.getAllPosts);
router.get('/inquiry/:id', setCategory("inquiry"), postController.getPostById);
router.post('/inquiry/', setCategory("inquiry"), postController.createPost);
router.put('/inquiry/', setCategory("inquiry"), postController.updatePost);
router.delete('/inquiry/:id', setCategory("inquiry"), postController.deletePost);

router.get('/review', setCategory("review"), postController.getAllPosts);
router.get('/review/:id', setCategory("review"), postController.getPostById);
router.post('/review/', setCategory("review"), postController.createPost);
router.put('/review/', setCategory("review"), postController.updatePost);
router.delete('/review/:id', setCategory("review"), postController.deletePost);

router.get('/notice', setCategory("notice"), postController.getAllPosts);
router.get('/notice/:id', setCategory("notice"), postController.getPostById);
router.post('/notice/', checkUserRole(8), setCategory("notice"), postController.createPost);
router.put('/notice/', checkUserRole(8), setCategory("notice"), postController.updatePost);
router.delete('/notice/:id', checkUserRole(8), setCategory("notice"), postController.deletePost);

module.exports = router;
