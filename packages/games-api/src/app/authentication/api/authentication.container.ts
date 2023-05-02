import {Injectable} from '@nestjs/common';

@Injectable({})
export class AuthenticationContainer {
	public signin() {
		return 'signin';
	}

	public signup() {
		return 'signup';
	}
}
