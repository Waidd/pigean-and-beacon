import type EventEmitter from 'node:events';

/**
 * Code from https://www.jamesshore.com/v2/projects/nullables/testing-without-mocks#output-tracking
 */
export default class OutputTracker<T> {
	public static create() {
		return new OutputTracker();
	}

	private _emitter: EventEmitter | undefined;
	private _event: string | undefined;
	private readonly _data: T[];
	private readonly _trackerFn: (data: T) => void;

	public constructor() {
		this._data = [];
		this._trackerFn = (data: T) => this._data.push(data);
	}

	public register(emitter: EventEmitter, event: string): void {
		this._emitter = emitter;
		this._event = event;
		this._emitter.on(this._event, this._trackerFn);
	}

	public get data(): T[] {
		return this._data;
	}

	public clear(): T[] {
		const result = [...this._data];
		this._data.length = 0;
		return result;
	}

	public stop(): void {
		if (!this._emitter || !this._event) return;
		this._emitter.off(this._event, this._trackerFn);
		this._emitter = undefined;
		this._event = undefined;
	}
}
