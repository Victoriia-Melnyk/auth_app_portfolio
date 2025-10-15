import { useContext, useEffect, useState } from 'react';
import './App.css';
import { NavLink, Route, Routes } from 'react-router-dom';

import errorImage from './images/error.jpg';
import { HomePage } from './pages/HomePage';
import { AuthContext } from './components/AuthContext';
import { Loader } from './components/Loader';
import { RegistrationPage } from './pages/RegistrationPage';
import { AccountActivationPage } from './pages/AccountActivationPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import EmailChangeConfirmPage from './pages/EmailChangeConfirmPage';

function App() {
	const [error, setError] = useState<string | null>('');

	const context = useContext(AuthContext);

	useEffect(() => {
		if (!error) return;
		const timerId = setTimeout(() => setError(''), 3000);
		return () => clearTimeout(timerId);
	}, [error]);

	useEffect(() => {
		if (context) {
			context.checkAuth();
		}
	}, []);

	if (!context) {
		return <div>Auth context not available</div>;
	}

	const { isChecked } = context;

	if (!isChecked) {
		return <Loader />;
	}

	return (
		<div className="App">
			<nav className="navbar bg-base-100 shadow z-10 w-full flex justify-between">
				<div role="tablist" className="tabs tabs-border">
					<NavLink
						to="/"
						role="tab"
						className={({ isActive }) => (isActive ? 'tab tab-active' : 'tab')}
					>
						Home
					</NavLink>
					<NavLink
						to="/profile"
						role="tab"
						className={({ isActive }) => (isActive ? 'tab tab-active' : 'tab')}
					>
						My profile
					</NavLink>
				</div>
				<div className="flex-1 flex justify-end gap-3">
					<NavLink
						to="/registration"
						className="btn btn-outline btn-success"
						type="button"
					>
						Sign up
					</NavLink>
					<NavLink to="/login" className="btn btn-success" type="button">
						Log in
					</NavLink>
				</div>
			</nav>
			<main>
				<section className="section">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/registration" element={<RegistrationPage />} />
						<Route
							path="/activation/:activationToken"
							element={<AccountActivationPage />}
						/>
						<Route path="login" element={<LoginPage />} />
						<Route path="profile" element={<ProfilePage />} />
						<Route
							path="/profile/change-email/:token"
							element={<EmailChangeConfirmPage />}
						/>
					</Routes>
				</section>

				{error && (
					<>
						<div
							role="alert"
							className="alert alert-error w-9/12 mt-16 mx-auto"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{error}</span>
						</div>
						<img src={errorImage} alt="error" className="error-image" />
					</>
				)}
			</main>
		</div>
	);
}

export default App;
