import {type Client} from 'pg';
import {type MigrationFn} from 'umzug';

export const up: MigrationFn<Client> = async ({context: client}) => {
	await client.query(`
		CREATE TABLE IF NOT EXISTS player_ (
			id serial4 NOT NULL,
			email varchar(255) NOT NULL,
			hash varchar(255) NOT NULL,
			display_name varchar(255) NOT NULL,
			created_at timestamp NOT NULL DEFAULT now(),
			updated_at timestamp NOT NULL DEFAULT now(),
			CONSTRAINT player_pkey PRIMARY KEY (id),
			CONSTRAINT player_email_ukey UNIQUE (email),
			CONSTRAINT player_display_name_ukey UNIQUE (display_name)
		);
	`);
};

export const down: MigrationFn<Client> = async ({context: client}) => {
	await client.query(`DROP TABLE IF EXISTS user_`);
};
