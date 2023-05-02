import {type Client} from 'pg';
import {type MigrationFn} from 'umzug';

export const up: MigrationFn<Client> = async ({context: client}) => {
	// Up
};

export const down: MigrationFn<Client> = async ({context: client}) => {
	// Down
};
