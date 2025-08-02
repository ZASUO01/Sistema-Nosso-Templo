import { UsersRepository } from '../repositories/users-repository'
import { User } from '../../enterprise/user'
import { HashGenerator } from '../../criptography/hash-generator'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { Either, left, right } from '@/domain/core/either'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { UserUnauthorizedError } from '../errors/user-unauthorized-error'
import { PermissionVerifier } from '../utils/permission-verifier'

interface CreateUserUseCaseRequest {
  changeById: string
  firstName: string
  lastName: string
  nick?: string
  email: string
  password: string
  phone?: string
}

type CreateUserUseCaseResponse = Either<
  UserNotFoundError | UserAlreadyExistsError | UserUnauthorizedError,
  { user: User }
>

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private permissionVerifier: PermissionVerifier,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    changeById,
    firstName,
    lastName,
    nick,
    email,
    password,
    phone,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const verificationError = await this.permissionVerifier.verify(changeById)

    if (verificationError) {
      return left(verificationError)
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(userWithSameEmail.id.toString()))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      firstName,
      lastName,
      nick,
      email,
      password_hash: hashedPassword,
      phone,
      level: 'DEFAULT',
      status: 'ACTIVE',
      createdAt: new Date(),
    })

    await this.usersRepository.create(user)

    return right({
      user,
    })
  }
}
