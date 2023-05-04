import {
	NotFoundException,
	type HttpException,
	ConflictException,
	UnprocessableEntityException,
	InternalServerErrorException,
} from '@nestjs/common';
import {
	NotFoundError,
	ConflictError,
	UnprocessableError,
} from '../domain/domain.error.js';

export function domainToApiError(domainError: Error): HttpException {
	if (domainError instanceof NotFoundError)
		return new NotFoundException(domainError.message, {cause: domainError});
	if (domainError instanceof ConflictError)
		return new ConflictException(domainError.message, {cause: domainError});
	if (domainError instanceof UnprocessableError)
		return new UnprocessableEntityException(domainError.message, {
			cause: domainError,
		});
	return new InternalServerErrorException(domainError.message, {
		cause: domainError,
	});
}
