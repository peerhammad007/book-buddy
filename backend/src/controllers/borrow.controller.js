const BorrowRequest = require('../models/borrowRequest.model');
const Book = require('../models/book.model');

// @desc Request to borrow a book
// @route POST /api/v1/borrow
exports.requestBorrow = async (req, res) => {
  try {
    const { bookId, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.availability !== 'available') {
      return res.status(400).json({ message: 'Book not available' });
    }

    // Prevent duplicate borrow requests
    const existingRequest = await BorrowRequest.findOne({
      bookId,
      borrowerId: req.user._id,
      status: { $in: ['pending', 'approved'] }
    });
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending or active borrow request for this book.' });
    }

    const borrowRequest = await BorrowRequest.create({
      bookId,
      borrowerId: req.user._id,
      lenderId: book.ownerId,
      status: 'pending',
      dates: { dueDate },
    });

    res.status(201).json(borrowRequest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to request book', error: err.message });
  }
};

// @desc Approve or reject a borrow request
// @route PUT /api/v1/borrow/:id/decision
exports.respondToRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const request = await BorrowRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.lenderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    request.status = status;
    if (status === 'approved') {
      await Book.findByIdAndUpdate(request.bookId, { availability: 'on-loan' });
    }

    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update request', error: err.message });
  }
};

// @desc Mark a book as returned
// @route PUT /api/v1/borrow/:id/return
exports.markAsReturned = async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.lenderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    request.status = 'returned';
    request.dates.returnDate = new Date();

    await request.save();
    await Book.findByIdAndUpdate(request.bookId, { availability: 'available' });

    res.json({ message: 'Book marked as returned', request });
  } catch (err) {
    res.status(500).json({ message: 'Failed to return book', error: err.message });
  }
};

// @desc Get all borrow history for current user (combined)
// @route GET /api/v1/borrow/history
exports.getBorrowHistory = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({
      $or: [{ borrowerId: req.user._id }, { lenderId: req.user._id }],
    })
      .populate('bookId', 'title author')
      .populate('borrowerId', 'name')
      .populate('lenderId', 'name');

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
};

// @desc Get borrower's requests (for TrackBorrowsComponent)
// @route GET /api/v1/borrow/my-borrows
exports.getMyBorrows = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({
      borrowerId: req.user._id,
    })
      .populate('bookId', 'title author')
      .populate('borrowerId', 'name')
      .populate('lenderId', 'name');

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch borrows', error: err.message });
  }
};

// @desc Get pending requests for lender (for LenderRequestsComponent)
// @route GET /api/v1/borrow/pending-requests
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({
      lenderId: req.user._id,
      status: 'pending'
    })
      .populate('bookId', 'title author')
      .populate('borrowerId', 'name')
      .populate('lenderId', 'name');

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending requests', error: err.message });
  }
};

// @desc Get approved/returned books (for TrackLentBooksComponent)
// @route GET /api/v1/borrow/lent-books
exports.getLentBooks = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({
      lenderId: req.user._id,
      status: { $in: ['approved', 'returned'] }
    })
      .populate('bookId', 'title author')
      .populate('borrowerId', 'name')
      .populate('lenderId', 'name');

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch lent books', error: err.message });
  }
};
