import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { MailIcon } from '../images/icons/Mail';
import img from '../images/login.jpg';
import cn from 'classnames';

import { AuthContext } from '../components/AuthContext';
import { Loading } from '../images/icons/Loading';
import { ErrorIcon } from '../images/icons/ErrorIcon';

//#region functions
function validateEmail(value: string) {
	if (!value) {
		return 'Email is required';
	}

	const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

	if (!emailPattern.test(value)) {
		return 'Email is not valid';
	}
}

function validatePassword(value: string) {
	if (!value) {
		return 'Password is required';
	}

	if (value.length < 6) {
		return 'At least 6 characters';
	}
}
//#endregion

//#region Tailwind class helpers
const inputClass = (error: boolean) =>
	cn(
		'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
		{
			'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500':
				!!error,
		}
	);

const buttonBaseClass = 'font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2';
const buttonLoadingClass = cn(
	buttonBaseClass,
	'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center'
);
const buttonSubmitClass = cn(
	buttonBaseClass,
	'text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-center'
);

//#endregion

export const LoginPage = () => {
	const [error, setError] = useState('');
	const authContext = useContext(AuthContext);

	if (!authContext) {
		throw new Error('AuthContext is undefined');
	}

	const { login, user } = authContext;
	const navigate = useNavigate();

	useEffect(() => {
		if (!error) return;
		const timerId = setTimeout(() => setError(''), 3000);
		return () => clearTimeout(timerId);
	}, [error]);

	if (user) {
		return (
			<section className="flex items-center justify-center text-center h-full">
				<div className="max-w-md w-full flex flex-col items-center gap-4 border border-green-400 bg-green-50 text-green-800 rounded-xl px-6 py-8 shadow-lg animate-fade-in">
					<span className="text-4xl">✅</span>
					<h1 className="font-bold text-2xl">You are already logged in</h1>
					<p className="text-base text-green-900">
						You have already logged in and can access your profile.
					</p>
					<Link
						to="/profile"
						className="mt-4 px-5 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow hover:from-green-500 hover:to-blue-600 transition"
					>
						Go to Profile
					</Link>
				</div>
			</section>
		);
	}

	return (
		<div className="flex flex-col  md:items-center justify-center">
			<img
				src={img}
				alt="registration"
				className="hidden md:block h-[150px] mt-6 rounded-full"
			/>
			<div className="w-full md:w-1/2">
				<Formik
					initialValues={{
						email: '',
						password: '',
					}}
					validateOnMount={true}
					onSubmit={({ email, password }) => {
						return login({ email, password })
							.then(() => {
								navigate('/profile');
							})
							.catch(error => {
								setError(error.response?.data?.message);
							});
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						<Form>
							<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
								<legend className="fieldset-legend text-2xl font-bold mb-4">
									Logg in
								</legend>
								<label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Email
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
										<MailIcon />
									</div>
									<Field
										validate={validateEmail}
										name="email"
										type="email"
										id="email"
										placeholder="e.g. bobsmith@gmail.com"
										className={cn(
											inputClass(!!(touched.email && errors.email)),
											'ps-10'
										)}
									/>
								</div>
								{touched.email && errors.email && (
									<p className="mt-2 text-sm text-red-600 dark:text-red-500">
										{errors.email}
									</p>
								)}
								<label
									htmlFor="password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Password
								</label>
								<Field
									validate={validatePassword}
									name="password"
									type="password"
									id="password"
									placeholder="*******"
									className={inputClass(
										!!(touched.password && errors.password)
									)}
								/>
								{touched.password && errors.password && (
									<p className="mt-2 text-sm text-red-600 dark:text-red-500">
										{errors.password}
									</p>
								)}
								{isSubmitting ? (
									<button disabled type="button" className={buttonLoadingClass}>
										<Loading />
										Loading...
									</button>
								) : (
									<button type="submit" className={buttonSubmitClass}>
										Logg in
									</button>
								)}
								<div className="flex flex-row items-center gap-1 whitespace-nowrap mt-2">
									<span>Dont have an account?</span>
									<Link
										to="/registration"
										className="underline text-blue-600 hover:text-blue-800"
									>
										Register
									</Link>
								</div>
							</fieldset>
						</Form>
					)}
				</Formik>

				{error && (
					<div className="flex items-center border-2 border-red-600 bg-white text-red-700 font-bold rounded-lg shadow-lg px-6 py-3 mt-4 text-center text-lg gap-3">
						{ErrorIcon}
						<span>{error}</span>
					</div>
				)}
			</div>
		</div>
	);
};
