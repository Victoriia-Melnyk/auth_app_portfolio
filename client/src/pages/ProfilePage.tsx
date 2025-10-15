import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthContext';
import photo from '../images/user.jpg';
import { userService } from '../services/userService';
import { NavLink } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
	// name state
	const [editingName, setEditingName] = useState(false);
	const [editValue, setEditValue] = useState('');
	// email state
	const [editingEmail, setEditingEmail] = useState(false);
	const [newEmail, setNewEmail] = useState('');
	const [emailPassword, setEmailPassword] = useState('');
	// password state
	const [editingPassword, setEditingPassword] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	// common state
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [info, setInfo] = useState('');

	const authContext = useContext(AuthContext);
	const user = authContext?.user;

	useEffect(() => {
		if (info) {
			const timer = setTimeout(() => {
				setInfo('');
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [info]);

	if (!user) {
		return (
			<div className="flex flex-col gap-4 items-center justify-center min-h-screen">
				<div className="text-center text-xl text-red-600">
					You are not authorized
				</div>
				<NavLink
					to="/login"
					className="btn btn-success animate-pulse transition-transform duration-300 hover:scale-110"
				>
					Log in
				</NavLink>
			</div>
		);
	}

	const handleLogout = async () => {
		await authContext.logout();
	};

	const handleChangeName = () => {
		setEditingName(true);
		setEditingEmail(false);
		setEditingPassword(false);
		setEditValue(user.name);
		setError('');
		setInfo('');
	};

	const handleSaveName = async () => {
		if (!editValue.trim()) {
			setError('Name cannot be empty');
			return;
		}
		setLoading(true);

		setError('');
		setInfo('');
		try {
			await userService.changeName(user.id, editValue.trim());
			await authContext.checkAuth();
			setInfo('Name updated successfully');
			setEditingName(false);
			setEditValue('');
		} catch (e: any) {
			setError(e?.response?.data?.message || 'Update failed');
		} finally {
			setLoading(false);
		}
	};

	const handleCancelName = () => {
		setEditingName(false);
		setEditValue('');
		setError('');
		setInfo('');
	};

	const handleChangeEmail = () => {
		setEditingEmail(true);
		setEditingName(false);
		setEditingPassword(false);
		setError('');
		setInfo('');
	};

	const handleSaveEmail = async () => {
		if (!newEmail.trim()) {
			setError('Email cannot be empty');
			return;
		}
		if (!emailPassword.trim()) {
			setError('Password cannot be empty');
			return;
		}

		setLoading(true);

		setError('');

		try {
			await userService.changeEmail(
				user.id,
				emailPassword.trim(),
				newEmail.trim()
			);
			setInfo('Confirmation link sent to new email');
			await authContext.checkAuth();
			setNewEmail('');
			setEmailPassword('');
			setEditingEmail(false);
		} catch (e: any) {
			setError(e?.response?.data?.message || 'Update failed');
		} finally {
			setLoading(false);
		}
	};

	const handleCancelEmail = () => {
		setEditingEmail(false);
		setNewEmail('');
		setEmailPassword('');
		setError('');
	};

	const handleChangePassword = () => {
		setEditingPassword(true);
		setEditingName(false);
		setEditingEmail(false);
		setError('');
		setInfo('');
	};

	const handleCancelEditingPassword = () => {
		setEditingPassword(false);
		setCurrentPassword('');
		setNewPassword('');
		setConfirmPassword('');
		setError('');
	};

	const handleSavePassword = async () => {
		if (
			!currentPassword.trim() ||
			!newPassword.trim() ||
			!confirmPassword.trim()
		) {
			setError('All password fields are required');
			return;
		}

		if (newPassword !== confirmPassword) {
			setError('New passwords do not match');
			return;
		}

		setLoading(true);

		setError('');

		try {
			await userService.changePassword(
				user.id,
				currentPassword.trim(),
				newPassword.trim(),
				confirmPassword.trim()
			);
			setInfo('Password updated successfully');
			await authContext.checkAuth();
			setEditingPassword(false);
			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');
		} catch (e: any) {
			setError(e?.response?.data?.message || 'Update failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg flex flex-col items-center">
			{info && (
				<div className="w-full mb-4 text-green-700 bg-green-100 border border-green-300 rounded-lg px-4 py-2 text-center">
					{info}
				</div>
			)}
			<img
				src={photo}
				alt="User avatar"
				className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-200"
			/>
			<h2 className="text-2xl font-bold mb-2">{user.name}</h2>
			<p className="text-gray-600 mb-1 w-full text-center">{user.email}</p>

			<div className="flex flex-col gap-3 w-full mt-4">
				{editingName ? (
					<div className="w-full flex flex-col items-center gap-2 mb-4">
						<input
							type="text"
							value={editValue}
							onChange={e => setEditValue(e.target.value)}
							className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
							disabled={loading}
							autoFocus
						/>
						{error && <div className="text-red-600 text-sm">{error}</div>}
						<div className="flex gap-2 w-full mt-2">
							<button
								onClick={handleSaveName}
								className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
								disabled={loading}
							>
								Save
							</button>
							<button
								onClick={handleCancelName}
								className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
								disabled={loading}
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					<>
						<button
							onClick={handleChangeName}
							className="w-full py-2 px-4 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition mb-2"
						>
							Change Name
						</button>
					</>
				)}
				{editingEmail ? (
					<div className="w-full flex flex-col items-center gap-2 mb-4">
						<input
							type="password"
							placeholder="Current password"
							value={emailPassword}
							onChange={e => setEmailPassword(e.target.value)}
							className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
							disabled={loading}
							autoFocus
						/>
						<input
							type="email"
							placeholder="New email"
							value={newEmail}
							onChange={e => setNewEmail(e.target.value)}
							className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
							disabled={loading}
						/>
						{error && <div className="text-red-600 text-sm">{error}</div>}
						<div className="flex gap-2 w-full mt-2">
							<button
								onClick={handleSaveEmail}
								className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
								disabled={loading}
							>
								Save
							</button>
							<button
								onClick={handleCancelEmail}
								className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
								disabled={loading}
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					<>
						<button
							onClick={handleChangeEmail}
							className="w-full py-2 px-4 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-medium transition"
						>
							Change Email
						</button>
					</>
				)}
				{editingPassword ? (
					<div className="w-full flex flex-col items-center gap-2 mb-4">
						<input
							type="password"
							placeholder="Current password"
							value={currentPassword}
							onChange={e => setCurrentPassword(e.target.value)}
							className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
							disabled={loading}
							autoFocus
						/>
						<input
							type="password"
							placeholder="New password"
							value={newPassword}
							onChange={e => setNewPassword(e.target.value)}
							className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
							disabled={loading}
							autoFocus
						/>
						<input
							type="password"
							placeholder="Confirm new password"
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
							className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
							disabled={loading}
							autoFocus
						/>
						{error && <div className="text-red-600 text-sm">{error}</div>}
						<div className="flex gap-2 w-full mt-2">
							<button
								onClick={handleSavePassword}
								className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
								disabled={loading}
							>
								Save
							</button>
							<button
								onClick={handleCancelEditingPassword}
								className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
								disabled={loading}
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					<>
						<button
							onClick={handleChangePassword}
							className="w-full py-2 px-4 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-medium transition"
						>
							Change Password
						</button>
					</>
				)}

				<button
					onClick={handleLogout}
					className="w-full py-2 px-4 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium transition mt-2"
				>
					Logout
				</button>
			</div>
		</div>
	);
};
