const express = require('express');
const router = express.Router();
const users = require('../controllers/users.js');
const { route } = require('./travels.js');

// router.get('/', users.getUsers);
router.get('/profile', users.getProfile);
module.exports = router;