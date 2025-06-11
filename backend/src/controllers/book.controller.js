const Book = require('../models/book.model');

// @desc Create a new book
// @route POST /api/v1/books
exports.createBook = async (req, res) => {
  try {
    const { title, author, genre, condition } = req.body;

    const book = new Book({
      title,
      author,
      genre,
      condition,
      ownerId: req.user._id,
      image: req.file ? req.file.path : null,
    });

    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create book', error: err.message });
  }
};

// @desc Get all books (with optional filters)
// @route GET /api/v1/books
exports.getBooks = async (req, res) => {
  try {
    const { title, author, genre } = req.query;
    const query = {};

    if (title) query.title = new RegExp(title, 'i');
    if (author) query.author = new RegExp(author, 'i');
    if (genre) query.genre = genre;

    const books = await Book.find(query).populate('ownerId', 'name');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
};

// @desc Get a single book by ID
// @route GET /api/v1/books/:id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('ownerId', 'name');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch book', error: err.message });
  }
};

// @desc Update a book
// @route PUT /api/v1/books/:id
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, author, genre, condition, availability } = req.body;

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.condition = condition || book.condition;
    book.availability = availability || book.availability;

    if (req.file) {
      book.image = req.file.path;
    }

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update book', error: err.message });
  }
};

// @desc Delete a book
// @route DELETE /api/v1/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await book.remove();
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete book', error: err.message });
  }
};
