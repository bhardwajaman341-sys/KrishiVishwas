const user = require('../models/user');

// @desc    Register a new Farmer
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, phoneNumber, password, state, district } = req.body;

        // 1. Check if user already exists
        const userExists = await user.findOne({ phoneNumber });
        if (userExists) {
            return res.status(400).json({ message: 'User already registered with this number' });
        }

        // 2. Create the user in the local database
        const user = await user.create({
            name,
            phoneNumber,
            password,
            state,
            district
        });

        res.status(201).json({
            success: true,
            message: 'Farmer registered successfully!',
            data: { id: user._id, name: user.name }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};