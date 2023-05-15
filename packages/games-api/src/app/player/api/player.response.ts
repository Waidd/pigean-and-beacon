import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class PlayerResponse {
	@ApiProperty({
		example: 'foo@bar.com',
	})
	@IsEmail()
	@IsNotEmpty()
	public email!: string;

	@ApiProperty({
		example: 'Sir Foo Bar',
	})
	@IsString()
	@IsNotEmpty()
	public displayName!: string;
}
