const userService = require('../services/user-service');
const UserDTO = require('../dtos/user-dto');
const PagingDTO = require('../dtos/paging-request-dto');

exports.getAllUsers = async (req, res, next) => {
    try {
        const paging = new PagingDTO(req.query);
        const param = new UserDTO(req.query);
        const users = await userService.getAllUsers({ ...param, ...paging });
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            const error = new Error('유효하지 않은 ID입니다.');
            error.status = 400;
            throw error;
        }

        const user = await userService.getUserById(id);
        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            const error = new Error('Name and email are required');
            error.status = 400;
            throw error;
        }

        const newUser = await userService.createUser(name, email);
        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            const error = new Error('유효하지 않은 ID입니다.');
            error.status = 400;
            throw error;
        }

        const { name, email } = req.body;
        if (!name && !email) {
            const error = new Error('At least one field (name or email) is required');
            error.status = 400;
            throw error;
        }

        const updatedUser = await userService.updateUser(id, { name, email });
        if (!updatedUser) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        res.json(updatedUser);
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            const error = new Error('유효하지 않은 ID입니다.');
            error.status = 400;
            throw error;
        }

        const deleted = await userService.deleteUser(id);
        if (!deleted) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
