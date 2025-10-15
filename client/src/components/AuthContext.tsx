import React, { ReactNode, useMemo, useState } from 'react';
import { accessTokenService } from '../services/accessTokenService.js';
import { authService } from '../services/authService';

interface User {
	id: string;
	name: string;
	email: string;
}

interface AuthContextType {
	isChecked: boolean;
	user: User | null;
	checkAuth: () => Promise<void>;
	activate: (activationToken: string) => Promise<void>;
	login: (params: { email: string; password: string }) => Promise<void>;
	logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(
	undefined
);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isChecked, setChecked] = useState(true);

	async function activate(activationToken: string) {
		const response = await authService.activate(activationToken);
		const { accessToken, user } = response;

		accessTokenService.save(accessToken);

		setUser(user);
	}

	async function checkAuth() {
		try {
			const response = await authService.refresh();
			const { accessToken, user } = response;

			accessTokenService.save(accessToken);
			setUser(user);
		} catch (error) {
			// User is not authenticated;
		} finally {
			setChecked(true);
		}
	}

	async function login({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) {
		const response = await authService.login({ email, password });
		const { accessToken, user } = response;

		accessTokenService.save(accessToken);
		setUser(user);
	}

	async function logout() {
		try {
			await authService.logout();
		} catch (error: any) {
			if (error?.response?.status !== 401) {
				throw error;
			}
		}

		accessTokenService.remove();
		setUser(null);
	}

	const value = useMemo(
		() => ({
			isChecked,
			user,
			checkAuth,
			activate,
			login,
			logout,
		}),
		[user, isChecked]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
