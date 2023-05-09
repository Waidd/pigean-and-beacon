/* eslint-disable @typescript-eslint/naming-convention */
import process from 'node:process';
import * as dotenv from 'dotenv';
import {cleanEnv, str, url} from 'envalid';

dotenv.config();

const configuration = cleanEnv(process.env, {
	NODE_ENV: str({
		choices: ['development', 'test', 'production', 'staging'],
		default: 'development',
	}),
	DATABASE_URL: url(),
	DATABASE_TEST_URL: url(),
	JWT_SECRET: str(),
});

export default configuration;
