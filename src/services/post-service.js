const postMapper = require('../mapper/post-mapper');

const getAllPosts = async ({category, page, limit}) => {
    return await postMapper.findAllWithCount({ category, page, limit });
};

const getPostById = async (id) => {
    return await postMapper.findById(id);
};

const createPost = async (postData) => {
    const {category, title, content} = postData;
    if (!category || !title || !content) {
        throw new Error('category, title, content는 필수입니다.');
    }
    return await postMapper.insert(postData);
};

const updatePost = async (id, postData) => {
    return await postMapper.update(id, postData);
};

const updatePostViewCount = async (id) => {
    return await postMapper.updateViews(id);
};

const deletePost = async (id) => {
    return await postMapper.softDelete(id);
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
