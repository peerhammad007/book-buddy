const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/register', upload.single('profileImg'), register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;
