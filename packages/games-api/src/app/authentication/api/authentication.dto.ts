import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class AuthenticationDto {
	@IsEmail()
	@IsNotEmpty()
	public email!: string;

	@IsString()
	@IsNotEmpty()
	password!: string;

	@IsString()
	@IsNotEmpty()
	displayName!: string;
}
