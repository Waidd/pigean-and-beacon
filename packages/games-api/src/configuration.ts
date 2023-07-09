/* eslint-disable @typescript-eslint/naming-convention */
import process from 'node:process';
import * as dotenv from 'dotenv';
import {bool, cleanEnv, str, url} from 'envalid';

dotenv.config();

const configuration = cleanEnv(process.env, {
	NODE_ENV: str({
		choices: ['development', 'test', 'production', 'staging'],
		default: 'development',
	}),
	DATABASE_URL: url(),
	DATABASE_TEST_URL: url(),
	JWT_SECRET: str(),
	NULL_MODE: bool(),
});

function getDatabaseUrl(): string {
	return configuration.isTest
		? configuration.DATABASE_TEST_URL
		: configuration.DATABASE_URL;
}

function isInNullMode(): boolean {
	return !configuration.isTest && configuration.NULL_MODE;
}

export {configuration, getDatabaseUrl, isInNullMode};
