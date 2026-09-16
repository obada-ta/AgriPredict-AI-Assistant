// const userModel = require("../models/userModel");
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const UserSignup = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // 1. Validate input
//         if (!email || !password) {
//             return res.status(400).json({ message: 'Email and password are required' });
//         }

//         // 2. Check if user already exists
//         const existingUser = await userModel.findOne({ email });
//         if (existingUser) {
//             return res.status(409).json({ message: 'Email already exists' }); // 409 Conflict is more appropriate
//         }

//         // 3. Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // 4. Create new user
//         const newUser = await userModel.create({
//             email,
//             password: hashedPassword
//         });

//         // 5. Generate JWT token
//         const token = jwt.sign(
//             {
//                 email: newUser.email,
//                 id: newUser._id
//             },
//             process.env.SECRET_KEY,
//             { expiresIn: '1h' } // Token expiration (recommended)
//         );
        

//         // 6. Return success response with token
//         return res.status(201).json({
//             message: 'User created successfully',
//             user: {
//                 id: newUser._id,
//                 email: newUser.email
//             },
//             token
//         });

//     } catch (error) {
//         console.error('Signup error:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };
// const UserLogin = async (req, res) => {

// }
// const getUser = async (req, res) => {


// }
// module.exports = { UserSignup, UserLogin, getUser }