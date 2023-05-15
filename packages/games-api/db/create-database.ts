import pg from 'pg';
import {getDatabaseUrl} from '../src/configuration.js';

const url = new URL(getDatabaseUrl());
const databaseName = url.pathname.slice(1);
url.pathname = '/postgres';

const client = new pg.Client(url.toString());
try {
	await client.connect();
	await client.query(`CREATE DATABASE ${databaseName};`);
} finally {
	await client.end();
}
