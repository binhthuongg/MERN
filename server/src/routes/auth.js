const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jsonwebtoken = require('jsonwebtoken');


const User = require('./../models/User');

router.get('/', (req, res) => {
	res.send('User route');
});

/**
 * route POST api/auth/register
 * Register user
 * Public
 */
router.post('/register', async(req, res) => {
	console.log('req.body', req.body)
	const {username, password} = req.body;
	/**
	* Validation
	*/
	if(!username || !password) {
		return res.status(400).json({
			success: false,
			message: 'Missing Username or/and Password!'
		})
	}

	try {
		/**
		* Check for existing user
		*/
		const user = await User.findOne({
			username: username
		});
		if(user) {
			console.log('user', user)
			return res.status(400).json({
				success: false,
				message: 'Username already taken!'
			})
		}
		/**
		* All good
		*/
		const hashedPassword = await argon2.hash(password);
		const newUser = new User({
			username: username,
			password: hashedPassword,
		});
		await newUser.save();

		/**
		* Return token
		*/
		const accessToken = jsonwebtoken.sign({
			userId: newUser._id
		}, process.env.ACCESS_TOKEN_SECRET);
		return res.status(200).json({
			success: true,
			message: 'Successful',
			accessToken: accessToken,
		})
		
	} catch (error) {
		console.log('error', error);
		res.status(500).json({
			success: false,
			message: 'Internal server'
		})
	}
})


/**
 * route POST api/auth/login
 * Login user
 * Public
 */
 router.post('/login', async(req, res) => {
	console.log('req.body', req.body)
	const {username, password} = req.body;
	/**
	* Validation
	*/
	if(!username || !password) {
		return res.status(400).json({
			success: false,
			message: 'Missing Username or/and Password!'
		})
	}

	try {
		/**
		* Check for existing user
		*/
		const user = await User.findOne({
			username: username
		});
		if(!user) {
			return res.status(400).json({
				success: false,
				message: 'Incorrect 1'
			})
		}
		/**
		* Check Password
		*/
		const passwordValid = await argon2.verify(user.password, password);
		if(!passwordValid) {
			return res.status(400).json({
				success: false,
				message: 'Incorrect 2'
			})
		}

		/**
		* All good
		* Return token
		*/
		const accessToken = jsonwebtoken.sign({
			userId: user._id
		}, process.env.ACCESS_TOKEN_SECRET);
		return res.status(200).json({
			success: true,
			message: 'Successful',
			accessToken: accessToken,
		})
		
	} catch (error) {
		console.log('error', error);
		res.status(500).json({
			success: false,
			message: 'Internal server'
		})
	}
})
module.exports = router;
