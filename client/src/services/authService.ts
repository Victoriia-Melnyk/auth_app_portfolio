import { authClient } from '../http/authClient.js';

export type AuthResponse = { accessToken: string; user: any };

function register({
	email,
	password,
	name,
}: {
	email: string;
	password: string;
	name: string;
}): Promise<any> {
	return authClient.post('/registration', { email, password, name });
}

function login({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<AuthResponse> {
	return authClient.post('/login', { email, password });
}

function logout(): Promise<any> {
	return authClient.post('/logout');
}

function activate(activationToken: string): Promise<AuthResponse> {
	return authClient.get(`/activation/${activationToken}`);
}

function refresh(): Promise<AuthResponse> {
	return authClient.get('/refresh');
}

export const authService = { register, login, logout, activate, refresh };
