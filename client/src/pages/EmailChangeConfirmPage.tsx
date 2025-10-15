import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { Link } from 'react-router-dom';
import { Loader } from '../components/Loader';

const EmailChangeConfirmPage: React.FC = () => {
	const [error, setError] = useState('');
	const [done, setDone] = useState(false);

	const { token } = useParams();

	useEffect(() => {
		if (!token) {
			setError('Invalid confirmation link.');
			return;
		}
		userService
			.confirmEmailChange(token)
			.catch(error => {
				const err = error.response?.data;
				setError(
					typeof err === 'string'
						? err
						: err?.message || 'Could not confirm your email change.'
				);
			})
			.finally(() => {
				setDone(true);
				setError('');
			});
	}, [token]);

	if (!done) {
		return <Loader />;
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-2">
			<div className="max-w-sm w-full text-center">
				{error ? (
					<div className="border border-red-400 bg-red-50 text-red-700 rounded-md px-4 py-3 mb-4">
						<div className="flex items-center justify-center gap-2 mb-1">
							<span className="text-xl">&#9888;</span>
							<span className="font-semibold">Email change not confirmed</span>
						</div>
						<div className="text-sm">{error}</div>
						<Link to="/profile" className="block mt-3 text-blue-600 underline">
							Back to profile
						</Link>
					</div>
				) : (
					<div className="flex flex-col items-center gap-3 border border-green-400 bg-green-50 text-green-800 rounded-md px-4 py-6 shadow-md animate-fade-in">
						<span className="text-4xl">✅</span>
						<span className="font-semibold text-xl">
							Your email has been successfully changed!
						</span>
						<span className="text-base text-green-900">
							You can now use your new email to log in and receive
							notifications.
						</span>
						<Link
							to="/profile"
							className="mt-4 px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow hover:from-green-500 hover:to-blue-600 transition"
						>
							Go to profile
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default EmailChangeConfirmPage;
