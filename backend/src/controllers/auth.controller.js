const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

// @route POST /api/v1/auth/register
exports.register = async (req, res) => {
  const { name, email, password, isLender, bio } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create user data object
    const userData = {
      name,
      email,
      password,
      isLender: true, // Always set to true to allow all users to lend books
      bio,
    };

    // Add profile image if uploaded
    if (req.file) {
      userData.profileImg = req.file.filename;
    }

    const user = await User.create(userData);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImg: user.profileImg,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route POST /api/v1/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      isLender: user.isLender,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/v1/auth/profile
exports.getProfile = async (req, res) => {
  res.json(req.user);
};
