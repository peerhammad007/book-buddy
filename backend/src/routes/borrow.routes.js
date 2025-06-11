const express = require('express');
const router = express.Router();
const {
  requestBorrow,
  respondToRequest,
  markAsReturned,
  getBorrowHistory,
} = require('../controllers/borrow.controller');

const { protect } = require('../middlewares/auth.middleware');

router.post('/', protect, requestBorrow);
router.put('/:id/decision', protect, respondToRequest);
router.put('/:id/return', protect, markAsReturned);
router.get('/history', protect, getBorrowHistory);

module.exports = router;
