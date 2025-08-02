import { FakeHashComparer } from '../../test/criptography/fake-hash-comparer'
import { FakeTokenGenerator } from '../../test/criptography/fake-token-generator'
import { InMemoryUsersRepository } from '../../test/repositories/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate-user'
import { makeUser } from '../../test/factories/make-user'
import { FakeHashGenerator } from '../../test/criptography/fake-hash-generator'
import { User } from '../../enterprise/user'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'

let usersRepository: InMemoryUsersRepository
let hashGenerator: FakeHashGenerator
let hashComparer: FakeHashComparer
let tokenGenerator: FakeTokenGenerator
let sut: AuthenticateUserUseCase
let user: User

describe('Auth - Authenticate User', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    hashComparer = new FakeHashComparer()
    hashGenerator = new FakeHashGenerator()
    tokenGenerator = new FakeTokenGenerator()
    sut = new AuthenticateUserUseCase(
      usersRepository,
      hashComparer,
      tokenGenerator,
    )

    user = makeUser({
      email: 'johndoe@example.com',
      password_hash: await hashGenerator.hash('123456'),
    })

    usersRepository.items.push(user)
  })

  it('should be able to authenticate user', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong email', async () => {
    const result = await sut.execute({
      email: 'invalid@example.com',
      password: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: 'invalid-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
