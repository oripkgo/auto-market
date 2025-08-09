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


const createUser = async ({email, passwordHash, name, phone, gender, agreePrivacy},conn) => {
    const newUser = {name, email, password_hash: passwordHash, phone_number: phone, gender: gender || 'other'};
    return await userMapper.insert(newUser, conn);
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
