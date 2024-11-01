const express = require('express');
const { createAccount, login, getUser } = require('../controllers/auth.js');
const { authenticateToken } = require('../utulities.js');
const router = express.Router();

router.post('/create-account', createAccount)
router.post('/login', login)
router.get('/get-user', authenticateToken, getUser)


module.exports = router;