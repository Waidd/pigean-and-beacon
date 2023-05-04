import process from 'node:process';
import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const url = new URL(process.env.DATABASE_URL!);
const genericDatabaseUrl = url.toString().replace(url.pathname, '/postgres');
const databaseName = url.pathname.slice(1);

const client = new pg.Client(genericDatabaseUrl);
try {
	await client.connect();
	await client.query(`DROP DATABASE ${databaseName};`);
} finally {
	await client.end();
}
