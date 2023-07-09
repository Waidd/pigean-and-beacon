import {Controller, Get} from '@nestjs/common';
import {ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {configuration} from '../../../configuration.js';
import {healthcheck} from '../../../database.js';

@ApiTags('00 - probes')
@Controller('probes')
export class ProbesController {
	@Get('version')
	@ApiOkResponse({type: String})
	public async getVersion() {
		return configuration.npm_package_version;
	}

	@Get('readiness')
	@ApiOkResponse({type: String})
	public async checkReadiness() {
		await healthcheck();
		return 'ok';
	}
}
