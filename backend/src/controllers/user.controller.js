const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

// @desc Get user by ID
// @route GET /api/v1/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc Update user profile
// @route PUT /api/v1/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { name, bio, isLender } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.isLender = true; // All users are now lenders by default

    if (req.file) {
      user.profileImg = req.file.path;
    }

    const updatedUser = await user.save();
    // Generate a new token for the updated user
    const token = generateToken(updatedUser._id);
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isLender: updatedUser.isLender,
      bio: updatedUser.bio,
      profileImg: updatedUser.profileImg,
      token // <-- include the new token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
