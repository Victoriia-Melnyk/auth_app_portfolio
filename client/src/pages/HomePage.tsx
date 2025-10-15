import React from 'react';
import heroImage from '../images/hero.jpg';
import { NavLink } from 'react-router-dom';

export const HomePage: React.FC = () => (
	<section className="flex flex-col items-center justify-center min-h-[60vh] bg-base-100 px-4 py-12">
		<img
			src={heroImage}
			alt="Welcome"
			className="w-36 h-36 md:w-60 md:h-60 object-cover rounded-full shadow-lg mb-6"
		/>
		<h1 className="text-4xl text-center	font-bold mb-4 text-primary">
			Welcome to Auth App!
		</h1>
		<p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
			This is a simple authentication app portfolio. Register or log in to
			explore protected features and see how authentication works in a modern
			React application.
		</p>
		<div className="flex gap-4">
			<NavLink
				to="/registration"
				className="btn btn-success animate-pulse transition-transform duration-300 hover:scale-110"
			>
				Get Started
			</NavLink>
			<NavLink to="/login" className="btn btn-outline btn-success">
				Log In
			</NavLink>
		</div>
	</section>
);
