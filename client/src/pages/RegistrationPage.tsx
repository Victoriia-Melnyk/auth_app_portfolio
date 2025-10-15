import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';
import img from '../images/register.jpg';
import { ErrorIcon } from '../images/icons/ErrorIcon';
import { authService } from '../services/authService';
import { MailIcon } from '../images/icons/Mail';
import { User } from '../images/icons/User';
import { Loading } from '../images/icons/Loading';

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

const validatePassword = (value: string) => {
	if (!value) {
		return 'Password is required';
	}
	if (value.length < 6) {
		return 'At least 6 characters';
	}
};

const validateName = (value: string) => {
	if (!value) {
		return 'Name is required';
	}
	if (value.length < 2) {
		return 'At least 2 characters';
	}
};

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

const usernameInputClass = (error: boolean) =>
	cn(
		'rounded-none rounded-e-lg bg-transparent border-0 focus:ring-0 focus:border-0 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-transparent dark:text-white',
		{
			'bg-red-50 border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:border-red-500':
				!!error,
		}
	);

const inputWrapperClass = (error: boolean) =>
	cn(
		'flex rounded-lg bg-gray-50 border text-gray-900 focus-within:ring-blue-500 focus-within:border-blue-500 min-w-0 w-full text-sm border-gray-300 p-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus-within:ring-blue-500 dark:focus-within:border-blue-500',
		{
			'bg-red-50 border-red-500 text-red-900 focus-within:ring-red-500 focus-within:border-red-500 dark:text-red-500 dark:border-red-500':
				!!error,
		}
	);

const iconSpanClass =
	'inline-flex items-center px-3 text-sm text-gray-900 rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600';

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

export const RegistrationPage: React.FC = () => {
	const [error, setError] = useState<string | null>('');
	const [registered, setRegistered] = useState(false);
	const authContext = useContext(AuthContext);
	const user = authContext?.user;

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
					<h1 className="font-bold text-2xl">You are already registered</h1>
					<p className="text-base text-green-900">
						You have already confirmed your email and are logged in.
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

	if (registered) {
		return (
			<section className="flex flex-col items-center justify-center min-h-screen text-center">
				<div className="max-w-md w-full flex flex-col items-center gap-4 border border-blue-400 bg-blue-50 text-blue-900 rounded-xl px-6 py-8 shadow-lg animate-fade-in">
					<span className="text-4xl">📧</span>
					<h1 className="font-bold text-2xl">Check your email</h1>
					<p className="text-base text-blue-900">
						We have sent you an email with the activation link.
						<br />
						Please follow the instructions in the email to activate your
						account.
					</p>
				</div>
			</section>
		);
	}

	return (
		<div className="flex flex-col md:flex-row md:items-center justify-center">
			<img
				src={img}
				alt="registration"
				className="hidden md:block md:w-[30%] h-auto mb-6 md:mb-0 p-5"
			/>
			<div className="w-full md:w-1/2">
				<Formik
					initialValues={{
						name: '',
						email: '',
						password: '',
					}}
					validateOnMount={true}
					onSubmit={({ name, email, password }, formikHelpers) => {
						formikHelpers.setSubmitting(true);

						authService
							.register({ name, email, password })
							.then(() => {
								setRegistered(true);
							})
							.catch(error => {
								if (!error.response?.data) {
									return;
								}

								const { errors, message } = error.response.data;

								formikHelpers.setFieldError('name', errors?.name);
								formikHelpers.setFieldError('email', errors?.email);
								formikHelpers.setFieldError('password', errors?.password);

								if (message) {
									setError(message);
								}
							})
							.finally(() => {
								formikHelpers.setSubmitting(false);
							});
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						<Form>
							<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
								<legend className="fieldset-legend text-2xl font-bold mb-4">
									Sign up
								</legend>
								<label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Your Email
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
									htmlFor="name"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Username
								</label>
								<div
									className={inputWrapperClass(!!(touched.name && errors.name))}
								>
									<span className={iconSpanClass}>
										<User />
									</span>
									<Field
										validate={validateName}
										name="name"
										type="text"
										id="name"
										placeholder="e.g. Bob Smith"
										className={usernameInputClass(
											!!(touched.name && errors.name)
										)}
									/>
								</div>
								{touched.name && errors.name && (
									<p className="mt-2 text-sm text-red-600 dark:text-red-500">
										{errors.name}
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
										Register
									</button>
								)}
								<div className="flex flex-row items-center gap-1 whitespace-nowrap mt-2">
									<span>Already have an account?</span>
									<Link
										to="/login"
										className="underline text-blue-600 hover:text-blue-800"
									>
										Log in
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
