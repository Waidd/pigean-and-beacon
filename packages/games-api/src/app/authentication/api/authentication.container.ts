import {Injectable} from '@nestjs/common';
import {SignUpUsecase} from '../domain/sign-up.usecase.js';
import {SignInUsecase} from '../domain/sign-in.usecase.js';

@Injectable({})
export class AuthenticationContainer {
	public signUp = SignUpUsecase.create();
	public signIn = SignInUsecase.create();
}
