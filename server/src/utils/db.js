import { Sequelize } from 'sequelize';

// Support two modes:
// - Production (RENDER): use DATABASE_URL env var
// - Local development: use DB_HOST / DB_USER / DB_PASSWORD / DB_DATABASE
const databaseUrl = process.env.DATABASE_URL;

export const client = databaseUrl
	? new Sequelize(databaseUrl, {
			dialect: 'postgres',
			protocol: 'postgres',
			dialectOptions:
				process.env.NODE_ENV === 'production'
					? { ssl: { require: true, rejectUnauthorized: false } }
					: {},
	  })
	: new Sequelize(
			process.env.DB_DATABASE || 'postgres',
			process.env.DB_USER || 'postgres',
			process.env.DB_PASSWORD || '',
			{
				host: process.env.DB_HOST || 'localhost',
				dialect: 'postgres',
			}
	  );
