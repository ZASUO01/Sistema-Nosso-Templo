import { UsersRepository } from '../repositories/users-repository'
import { User } from '../../enterprise/user'
import { HashGenerator } from '../../criptography/hash-generator'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { Either, left, right } from '@/domain/core/either'

interface CreateUserUseCaseRequest {
  firstName: string
  lastName: string
  nick?: string
  email: string
  password: string
}

type CreateUserUseCaseResponse = Either<UserAlreadyExistsError, { user: User }>

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    firstName,
    lastName,
    nick,
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(userWithSameEmail.id.toString()))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      firstName,
      lastName,
      nick: nick ?? null,
      email,
      password_hash: hashedPassword,
    })

    await this.usersRepository.create(user)

    return right({
      user,
    })
  }
}
