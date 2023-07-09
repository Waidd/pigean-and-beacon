import process from 'node:process';
import {type Request, type Response, type NextFunction} from 'express';
import {Injectable, type NestMiddleware, Logger} from '@nestjs/common';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
	private readonly logger = new Logger('HTTP');

	use(request: Request, response: Response, next: NextFunction): void {
		const startAt = process.hrtime();
		const {ip, method, originalUrl} = request;
		const userAgent = request.get('user-agent') ?? '';

		response.on('finish', () => {
			const {statusCode} = response;
			const contentLength = response.get('content-length') ?? 'N/A';
			const diff = process.hrtime(startAt);
			const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
			this.logger.log(
				`${method} ${originalUrl} ${statusCode} ${responseTime}ms ${contentLength} - ${userAgent} ${ip}`,
			);
		});

		next();
	}
}
