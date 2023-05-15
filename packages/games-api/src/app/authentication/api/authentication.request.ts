import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class SignUpRequest {
	@ApiProperty({
		example: 'foo@bar.com',
	})
	@IsEmail()
	@IsNotEmpty()
	public email!: string;

	@ApiProperty({
		example: 'a-very-secure-password',
	})
	@IsString()
	@IsNotEmpty()
	public password!: string;

	@ApiProperty({
		example: 'Sir Foo Bar',
	})
	@IsString()
	@IsNotEmpty()
	public displayName!: string;
}

export class SignInRequest {
	@ApiProperty({
		example: 'foo@bar.com',
	})
	@IsEmail()
	@IsNotEmpty()
	public email!: string;

	@ApiProperty({
		example: 'a-very-secure-password',
	})
	@IsString()
	@IsNotEmpty()
	public password!: string;
}
