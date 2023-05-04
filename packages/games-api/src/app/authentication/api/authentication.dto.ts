import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class SignUpDto {
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
