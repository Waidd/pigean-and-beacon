import {PlayerRepository} from '../../player/infrastructure/player.repository.js';
import {type Player} from '../../player/domain/player.entity.js';

export type SignUpCommand = Player;

export type SignUp = (
	command: SignUpCommand,
) => Promise<Player | EmailAlreadyExistsError | DisplayNameAlreadyTakenError>;

export class EmailAlreadyExistsError extends Error {
	private readonly __nominal!: void;
	constructor(email: string) {
		const message = `Email already taken: ${email}`;
		super(message);
		this.name = this.constructor.name;
	}
}

export class DisplayNameAlreadyTakenError extends Error {
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

	public async execute(
		command: SignUpCommand,
	): Promise<Player | EmailAlreadyExistsError | DisplayNameAlreadyTakenError> {
		const isEmailTaken = await this.playerRepository.isEmailTaken(
			command.email,
		);
		if (isEmailTaken) return new EmailAlreadyExistsError(command.email);

		const isDisplayNameTaken = await this.playerRepository.isDisplayNameTaken(
			command.displayName,
		);
		if (isDisplayNameTaken)
			return new DisplayNameAlreadyTakenError(command.displayName);

		return this.playerRepository.save(command);
	}
}
