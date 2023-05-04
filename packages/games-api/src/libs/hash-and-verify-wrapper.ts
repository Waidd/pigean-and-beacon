import * as argon from 'argon2';

export type HashAndVerify = {
	hash: (plain: string) => Promise<string>;
	verify: (hash: string, plain: string) => Promise<boolean>;
};

export class ArgonHashAndVerify implements HashAndVerify {
	public async hash(plain: string): Promise<string> {
		return argon.hash(plain);
	}

	public async verify(hash: string, plain: string): Promise<boolean> {
		return argon.verify(hash, plain);
	}
}

export class StubbedHashAndVerify implements HashAndVerify {
	public async hash(plain: string): Promise<string> {
		return 'hashed:' + plain;
	}

	public async verify(hash: string, plain: string): Promise<boolean> {
		return hash === 'hashed:' + plain;
	}
}
