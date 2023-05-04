import ConfigurableResponses from '../../../libs/configurable-responses.js';
import {
	PlayerRepository,
	type PlayerSql,
} from '../../player/infrastructure/player.repository.js';
import {type Player} from '../../player/domain/player.entity.js';

export type SignUpCommand = Player;

export type SignUp = (command: SignUpCommand) => Promise<Player>;

export class EmailAlreadyExistsError extends Error {
	private readonly __nominal!: void;
	constructor(email: string) {
		const message = `Email already exists: ${email}`;
		super(message);
		this.name = this.constructor.name;
	}
}

export class DisplayNameTaken extends Error {
	private readonly __nominal!: void;
	constructor(displayName: string) {
		const message = `Display name already taken: ${displayName}`;
		super(message);
		this.name = this.constructor.name;
	}
}

export class SignUpUsecase {
	public static create(): SignUp {
		const usecase = new SignUpUsecase(PlayerRepository.create());
		return usecase.execute.bind(usecase);
	}

	public static createNull(
		stubbedPlayerRepository = PlayerRepository.createNull(),
	): SignUp {
		const usecase = new SignUpUsecase(stubbedPlayerRepository);
		return usecase.execute.bind(usecase);
	}

	public constructor(private readonly playerRepository: PlayerRepository) {}

	public async execute(command: SignUpCommand): Promise<Player> {
		const isEmailTaken = await this.playerRepository.isEmailTaken(
			command.email,
		);
		if (isEmailTaken) throw new EmailAlreadyExistsError(command.email);

		const isDisplayNameTaken = await this.playerRepository.isDisplayNameTaken(
			command.displayName,
		);
		if (isDisplayNameTaken) throw new DisplayNameTaken(command.displayName);

		return this.playerRepository.save(command);
	}
}
