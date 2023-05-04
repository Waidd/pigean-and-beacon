import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class SignUpDto {
	@IsEmail()
	@IsNotEmpty()
	public email!: string;

	@IsString()
	@IsNotEmpty()
	public password!: string;

	@IsString()
	@IsNotEmpty()
	public displayName!: string;
}

export class SignInDto {
	@IsEmail()
	@IsNotEmpty()
	public email!: string;

	@IsString()
	@IsNotEmpty()
	public password!: string;
}
