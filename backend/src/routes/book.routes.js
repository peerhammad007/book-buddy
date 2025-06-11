const express = require('express');
const router = express.Router();
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require('../controllers/book.controller');

const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/', protect, upload.single('image'), createBook);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', protect, upload.single('image'), updateBook);
router.delete('/:id', protect, deleteBook);

module.exports = router;
