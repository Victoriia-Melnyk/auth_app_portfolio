import 'dotenv/config';
import fetch from 'node-fetch';

const RESEND_API = 'https://api.resend.com/emails';

async function send({ to, subject, html }) {
	const apiKey = process.env.RESEND_API_KEY;
	const from = process.env.SENDER_EMAIL;

	if (!apiKey || !from) {
		throw new Error('Missing RESEND_API_KEY or SENDER_EMAIL');
	}

	const body = { from, to, subject, html };

	const resp = await fetch(RESEND_API, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	if (!resp.ok) {
		const text = await resp.text();
		throw new Error(`Resend error: ${resp.status} ${text}`);
	}

	const data = await resp.json();
	console.log('✅ Email sent via Resend (test mode):', { to, subject });
	return data;
}

// === Email templates ===

function sendActivationEmail(email, token) {
	const href = `${process.env.CLIENT_HOST}/activation/${token}`;
	const html = `
    <h2>Activate your account</h2>
    <p>Click the link below to activate your account:</p>
    <a href="${href}">${href}</a>
  `;
	return send({ to: email, subject: 'Activate your account', html });
}

function sendResetPasswordEmail(email, resetPasswordToken) {
	const href = `${process.env.CLIENT_HOST}/reset-password/${resetPasswordToken}`;
	const html = `
    <h2>Reset your password</h2>
    <p>Click the link below to reset it:</p>
    <a href="${href}">${href}</a>
  `;
	return send({ to: email, subject: 'Reset your password', html });
}

export const emailService = {
	sendActivationEmail,
	sendResetPasswordEmail,
};
