// @ts-nocheck
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const authToken = writable(browser ? localStorage.getItem('token') : '');
export const user = writable(browser ? JSON.parse(localStorage.getItem('user') || 'null') : null);
export const isAuthenticated = writable(false);

export function setAuthToken(token) {
	if (browser) {
		if (token) {
			localStorage.setItem('token', token);
			document.cookie = `token=${token}; path=/; max-age=86400; samesite=lax`;
			authToken.set(token);
			isAuthenticated.set(true);
		} else {
			clearAuth();
		}
	}
}

export function setUser(userData) {
	if (browser) {
		localStorage.setItem('user', JSON.stringify(userData));
	}
	user.set(userData);
	isAuthenticated.set(true);
}

export function clearAuth() {
	if (browser) {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	}
	authToken.set('');
	user.set(null);
	isAuthenticated.set(false);
	console.log('Authentification effacée');
}

authToken.subscribe((value) => {
	if (browser && value) {
		localStorage.setItem('token', value);
		document.cookie = `token=${value}; path=/; max-age=86400; samesite=lax`;
		isAuthenticated.set(true);
	}
});

export function initAuth() {
	if (browser) {
		const token = localStorage.getItem('token');
		const userData = localStorage.getItem('user');

		if (token) {
			authToken.set(token);
			isAuthenticated.set(true);
		} else {
			authToken.set('');
			isAuthenticated.set(false);
		}

		if (userData) {
			user.set(JSON.parse(userData));
		} else {
			user.set(null);
		}
	}
}
