import {
	NotFoundException,
	ConflictException,
	UnprocessableEntityException,
	InternalServerErrorException,
	ForbiddenException,
} from '@nestjs/common';
import {
	NotFoundError,
	ConflictError,
	UnprocessableError,
	ForbiddenError,
} from '../domain/domain.error.js';

export function domainToApiError(domainError: Error): never {
	if (domainError instanceof NotFoundError)
		throw new NotFoundException(domainError.message, {cause: domainError});
	if (domainError instanceof ConflictError)
		throw new ConflictException(domainError.message, {cause: domainError});
	if (domainError instanceof UnprocessableError)
		throw new UnprocessableEntityException(domainError.message, {
			cause: domainError,
		});
	if (domainError instanceof ForbiddenError)
		throw new ForbiddenException(domainError.message, {
			cause: domainError,
		});
	throw new InternalServerErrorException(domainError.message, {
		cause: domainError,
	});
}
