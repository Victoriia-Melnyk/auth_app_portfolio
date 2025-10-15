// import { User } from '../models/User.js';
import { userService } from '../services/user.service.js';
import bcrypt from 'bcrypt';

const getUser = async (req, res) => {
	const user = await userService.getUserById(req.user.id);

	if (!user) {
		return res.sendStatus(404);
	}

	res.send(userService.normalizeUser(user));
};

const updateName = async (req, res) => {
	const { newName, userId } = req.body;

	if (!newName) {
		return res.status(400).send({ message: 'Name is required' });
	}

	const user = await userService.getUserById(userId);

	if (!user) {
		return res.sendStatus(404);
	}

	user.name = newName;

	await user.save();

	res.json({ message: 'Name successfully changed' });
};

const changePassword = async (req, res) => {
	const { userId, currentPassword, newPassword, newPasswordConfirmation } =
		req.body;

	if (!currentPassword || !newPassword || !newPasswordConfirmation) {
		return res.status(400).json({ message: 'All fields are required' });
	}

	if (newPassword !== newPasswordConfirmation) {
		return res.status(400).json({ message: 'Passwords do not match' });
	}

	const user = await userService.getUserById(userId);

	if (!user) {
		return res.sendStatus(404);
	}

	const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

	if (!isPasswordValid) {
		return res.status(401).json({ message: 'Old password is incorrect' });
	}

	user.password = await bcrypt.hash(newPassword, 10);
	await user.save();

	res.json({ message: 'Password successfully changed' });
};

const requestEmailChange = async (req, res) => {
	const { userId, password, newEmail } = req.body;

	if (!password || !newEmail) {
		return res
			.status(400)
			.json({ message: 'Password and new email are required' });
	}

	try {
		const result = await userService.emailChange(userId, password, newEmail);

		res.json(result);
	} catch (err) {
		res.status(err.status || 500).json({ message: err.message });
	}
};

const changeEmail = async (req, res) => {
	const { token } = req.params;

	try {
		const result = await userService.confirmEmailChange(token);

		res.json(result);
	} catch (err) {
		res.status(err.status || 500).json({ message: err.message });
	}
};

export const userController = {
	getUser,
	updateName,
	changePassword,
	requestEmailChange,
	changeEmail,
};
