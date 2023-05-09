import pg from 'pg';
import configuration from '../src/configuration.js';

const url = new URL(
	configuration.isTest
		? configuration.DATABASE_TEST_URL
		: configuration.DATABASE_URL,
);
const databaseName = url.pathname.slice(1);
url.pathname = '/postgres';

const client = new pg.Client(url.toString());
try {
	await client.connect();
	await client.query(`DROP DATABASE IF EXISTS ${databaseName};`);
} finally {
	await client.end();
}
