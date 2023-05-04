import {type PlayerSql} from '../../src/app/player/infrastructure/player.repository.js';
import ConfigurableResponses from '../../src/libs/configurable-responses.js';

describe('ConfigurableReponses - unit test', () => {
	const playerA = {
		id: 1,
		email: 'foo@bar.com',
		password: 'hashed:some-secret-hash',
		display_name: 'Foo Bar',
	};
	const playerB = {
		id: 2,
		email: 'john@doe.com',
		password: 'hashed:some-secret-hash3',
		display_name: 'John Doe',
	};

	it('should return the response for the requested label', () => {
		// Given
		const responses = new ConfigurableResponses<PlayerSql>([
			{
				label: 'player',
				mode: 'single',
				values: playerA,
			},
		]);

		// When
		const response = responses.next('player');

		// Then
		expect(response).toEqual(playerA);
	});

	it('should should return wildcard response when no label requested', () => {
		// Given
		const responses = new ConfigurableResponses<PlayerSql>([
			{
				label: 'player',
				mode: 'single',
				values: playerA,
			},
			{
				label: '*',
				mode: 'single',
				values: playerB,
			},
		]);

		// When
		const response = responses.next();

		// Then
		expect(response).toEqual(playerB);
	});

	it('should should return wildcard response when label not found', () => {
		// Given
		const responses = new ConfigurableResponses<PlayerSql>([
			{
				label: 'player',
				mode: 'single',
				values: playerA,
			},
			{
				label: '*',
				mode: 'single',
				values: playerB,
			},
		]);

		// When
		const response = responses.next('foo');

		// Then
		expect(response).toEqual(playerB);
	});

	it('should throw an error when no response is configured for label', () => {
		// Given
		const responses = new ConfigurableResponses<PlayerSql>([]);

		// When
		const response = () => responses.next('player');

		// Then
		expect(response).toThrowError('No response configured');
	});

	it('in array mode, should return different response at each call', () => {
		// Given
		const responses = new ConfigurableResponses<PlayerSql>([
			{
				label: 'player',
				mode: 'array',
				values: [playerA, undefined, playerB],
			},
		]);

		// When
		const responseA = responses.next('player');
		const responseUndefined = responses.next('player');
		const responseB = responses.next('player');

		// Then
		expect(responseA).toEqual(playerA);
		expect(responseUndefined).toBeUndefined();
		expect(responseB).toEqual(playerB);
	});

	it('in array mode, should return error when nore more response', () => {
		// Given
		const responses = new ConfigurableResponses<PlayerSql>([
			{
				label: 'player',
				mode: 'array',
				values: [playerA],
			},
		]);

		// When
		const responseA = responses.next('player');
		const responseB = () => responses.next('player');

		// Then
		expect(responseA).toEqual(playerA);
		expect(responseB).toThrowError('No more responses');
	});
});
