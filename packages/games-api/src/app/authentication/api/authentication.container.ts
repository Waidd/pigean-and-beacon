import {Injectable} from '@nestjs/common';
import {SignUpUsecase} from '../domain/sign-up.usecase.js';
import {SignInUsecase} from '../domain/sign-in.usecase.js';
import {isInNullMode} from '../../../configuration.js';

@Injectable({})
export class AuthenticationContainer {
	public signUp = isInNullMode() ? SignUpUsecase.createNull() : SignUpUsecase.create();
	public signIn = isInNullMode() ? SignInUsecase.createNull() : SignInUsecase.create();
}
