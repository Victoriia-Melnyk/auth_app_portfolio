import { httpClient } from '../http/httpClient.js';

function changeName(userId, newName) {
	return httpClient.patch('/profile/name', { userId, newName });
}

function changeEmail(userId, password, newEmail) {
	return httpClient.patch('/profile/email', { userId, password, newEmail });
}

function confirmEmailChange(token) {
	return httpClient.get(`/profile/change-email/${token}`);
}

function changePassword(
	userId,
	currentPassword,
	newPassword,
	newPasswordConfirmation
) {
	return httpClient.patch('/profile/password', {
		userId,
		currentPassword,
		newPassword,
		newPasswordConfirmation,
	});
}

export const userService = {
	changeName,
	changeEmail,
	confirmEmailChange,
	changePassword,
};
