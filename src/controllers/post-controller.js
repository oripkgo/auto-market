const postService = require('../services/post-service');
const PagingRequestDto = require('../dtos/paging-request-dto');
const PostDto = require('../dtos/post-dto');


exports.getAllPosts = async (req, res, next) => {
    try {
        const paging = new PagingRequestDto(req.query);
        const param = new PostDto(req.query);

        const posts = await postService.getAllPosts({...param, ...paging});
        res.json(posts);
    } catch (err) {
        next(err);
    }
};


exports.getPostById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            const error = new Error('유효하지 않은 ID입니다.');
            error.status = 400;
            throw error;
        }

        const post = await postService.getPostById(id);
        if (!post) {
            const error = new Error('게시물을 찾을 수 없습니다.');
            error.status = 404;
            throw error;
        }

        res.json(post);
    } catch (err) {
        next(err);
    }
};

exports.createPost = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const body = new PostDto(req.body);
        const newPost = await postService.createPost({...body, userId});
        res.status(201).json(newPost);
    } catch (err) {
        err.status = err.status || 400;
        next(err);
    }
};


exports.updatePost = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const id = Number(req.body.id);
        if (isNaN(id)) {
            const error = new Error('유효하지 않은 ID입니다.');
            error.status = 400;
            throw error;
        }

        const body = new PostDto({...req.body, userId});
        const updatedPost = await postService.updatePost(id, body);

        if (!updatedPost) {
            const error = new Error('게시물을 찾을 수 없습니다.');
            error.status = 404;
            throw error;
        }

        res.json(updatedPost);
    } catch (err) {
        next(err);
    }
};


exports.deletePost = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            const error = new Error('유효하지 않은 ID입니다.');
            error.status = 400;
            throw error;
        }

        const post = await postService.getPostById(id);

        if (post.userId !== req.user.userId) {
            const error = new Error('권한이 없습니다.');
            error.status = 403;
            throw error;
        }


        const deleted = await postService.deletePost(id);
        if (!deleted) {
            const error = new Error('게시물을 찾을 수 없습니다.');
            error.status = 404;
            throw error;
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};


