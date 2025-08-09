const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user-controller');
const checkUserRole = require('../middleware/role-check-middleware');

router.get('/', checkUserRole(8), usersController.getAllUsers);
router.get('/:id', checkUserRole(8), usersController.getUserById);
router.post('/', checkUserRole(8), usersController.createUser);
router.put('/:id', checkUserRole(8), usersController.updateUser);
router.delete('/:id', checkUserRole(8), usersController.deleteUser);

module.exports = router;
