import {ConflictError} from 'src/app/commun/domain/domain.error';
import {type Player} from 'src/app/player/domain/player.entity.js';
import {PlayerRepository} from 'src/app/player/infrastructure/player.repository';

export type SignInCommand = {
	email: string;
	password: string;
};

export type SignIn = (
	command: SignInCommand,
) => Promise<Player | InvalidCredentialsError>;

export class InvalidCredentialsError extends ConflictError {
	private readonly __nominal!: void;
	constructor() {
		const message = `Invalid credentials`;
		super(message);
		this.name = this.constructor.name;
	}
}

export class SignInUsecase {
	public static create(): SignIn {
		const usecase = new SignInUsecase(PlayerRepository.create());
		return usecase.execute.bind(usecase);
	}

	public static createNull(
		stubbedPlayerRepository = PlayerRepository.createNull(),
	): SignIn {
		const usecase = new SignInUsecase(stubbedPlayerRepository);
		return usecase.execute.bind(usecase);
	}

	public constructor(private readonly playerRepository: PlayerRepository) {}

	public async execute(
		command: SignInCommand,
	): Promise<Player | InvalidCredentialsError> {
		const player = await this.playerRepository.getByEmailAndPassword(
			command.email,
			command.password,
		);
		if (!player) return new InvalidCredentialsError();

		return player;
	}
}
