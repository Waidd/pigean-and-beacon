module.exports = {
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'node',
	maxWorkers: 1,
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
			},
		],
	},
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	setupFiles: ['dotenv/config'],
};
