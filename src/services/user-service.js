const userMapper = require('../mapper/user-mapper');

const getAllUsers = async ({page, limit}) => {
    return await userMapper.findAllWithPaging({page, limit});
};

const getUserById = async (id) => {
    return await userMapper.findById(id);
};


const getUserByEmail = async (email) => {
    return await userMapper.findByEmail(email);
};


const createUser = async (name, email) => {
    // 새 id 생성 (간단하게 마지막 id + 1)
    const users = await userMapper.findAll();
    const newId = users.length ? users[users.length - 1].id + 1 : 1;

    const newUser = {id: newId, name, email};
    return await userMapper.insert(newUser);
};

const updateUser = async (id, {name, email}) => {
    const existingUser = await userMapper.findById(id);
    if (!existingUser) return null;

    const updatedUser = {};
    if (name) updatedUser.name = name;
    if (email) updatedUser.email = email;

    return await userMapper.update(id, updatedUser);
};

const deleteUser = async (id) => {
    return await userMapper.remove(id);
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
};
