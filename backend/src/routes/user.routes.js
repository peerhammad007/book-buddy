const express = require('express');
const router = express.Router();
const { getUserById, updateUser } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware'); // for profile image

router.get('/:id', protect, getUserById);
router.put('/:id', protect, upload.single('profileImg'), updateUser);

module.exports = router;