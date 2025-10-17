import { Sequelize } from 'sequelize';

// export const client = new Sequelize({
//   host: process.env.DB_HOST,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   dialect: 'postgres',
// });

export const client = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	protocol: 'postgres',
	dialectOptions:
		process.env.NODE_ENV === 'production'
			? { ssl: { require: true, rejectUnauthorized: false } }
			: {},
});
