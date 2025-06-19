const express = require('express');
const router = express.Router();
const {
  requestBorrow,
  respondToRequest,
  markAsReturned,
  getBorrowHistory,
  getMyBorrows,
  getPendingRequests,
  getLentBooks,
} = require('../controllers/borrow.controller');

const { protect } = require('../middlewares/auth.middleware');

router.post('/', protect, requestBorrow);
router.put('/:id/decision', protect, respondToRequest);
router.put('/:id/return', protect, markAsReturned);
router.get('/history', protect, getBorrowHistory);
router.get('/my-borrows', protect, getMyBorrows);
router.get('/pending-requests', protect, getPendingRequests);
router.get('/lent-books', protect, getLentBooks);

module.exports = router;
