import {Injectable} from '@nestjs/common';
import {SignUpUsecase} from '../domain/sign-up.usecase.js';

@Injectable({})
export class AuthenticationContainer {
	public signup = SignUpUsecase.create();
	public signin() {
		return 'signup';
	}
}
