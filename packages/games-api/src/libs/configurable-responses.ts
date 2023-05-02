/**
 * Inspired from https://www.jamesshore.com/v2/projects/nullables/testing-without-mocks#configurable-responses
 */

export default class ConfigurableResponses<T> {
	/**
	 * Create a list of responses (by providing an array),
	 * mode:
	 * 	- single: single repeating response
	 *  - array; list of responses
	 */
	public static createSingle<T>(
		responses: T,
		name: string,
	): ConfigurableResponses<T> {
		return new ConfigurableResponses<T>(responses, 'single', name);
	}

	public static createList<T>(responses: T[], name: string) {
		return new ConfigurableResponses<T>(responses, 'array', name);
	}

	private readonly _description: string;
	private readonly _responses: T | T[];

	public constructor(
		responses: T | T[],
		private readonly _mode: 'single' | 'array',
		name: string,
	) {
		this._description = name === undefined ? '' : ` in ${name}`;
		this._responses = Array.isArray(responses) ? [...responses] : responses;
	}

	public next(): T {
		if (this._mode === 'single') return this._responses as T;
		if (!Array.isArray(this._responses))
			throw new Error(`Unexpected mode, expected array${this._description}`);
		const response = this._responses.shift();
		if (response === undefined)
			throw new Error(`No more responses configured${this._description}`);
		return response;
	}
}
