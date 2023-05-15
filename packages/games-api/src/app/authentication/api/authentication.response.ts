/* eslint-disable @typescript-eslint/naming-convention */
import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty} from 'class-validator';

export class SignInResponse {
	@ApiProperty({
		example: 'some-jwt-token',
	})
	@IsNotEmpty()
	public access_token!: string;
}
