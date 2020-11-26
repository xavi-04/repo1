var express = require('express');
var router = express.Router();
var { getUser, getUsers, newUser, updateUser, deleteUser } = require('../controller/users.controller');

/* GET users listing. */
router.get('/:username', getUser);
router.get('/', getUsers);
router.post('/', newUser);
router.put('/:username', updateUser);
router.delete('/:username', deleteUser);

module.exports = router;
