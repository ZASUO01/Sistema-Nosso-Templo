import { Either, left, right } from '@/domain/core/either'
import { HashComparer } from '../../criptography/hash-comparer'
import { UsersRepository } from '../repositories/users-repository'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'
import { TokenGenerator } from '../../criptography/token-generator'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private tokenGenerator: TokenGenerator,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const userFound = await this.usersRepository.findByEmail(email)

    if (!userFound) {
      return left(new WrongCredentialsError())
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      userFound.password_hash,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.tokenGenerator.generate({
      sub: userFound.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
