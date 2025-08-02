import { User } from '../../enterprise/user'
import { FakeHashGenerator } from '../../test/criptography/fake-hash-generator'
import { makeUser } from '../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../test/repositories/in-memory-users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { PermissionVerifier } from '../utils/permission-verifier'
import { CreateUserUseCase } from './create-user'

let usersRepository: InMemoryUsersRepository
let permissionVerifier: PermissionVerifier
let hashGenerator: FakeHashGenerator
let sut: CreateUserUseCase
let adminUser: User

describe('Auth - Create User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    permissionVerifier = new PermissionVerifier(usersRepository)
    hashGenerator = new FakeHashGenerator()
    sut = new CreateUserUseCase(
      usersRepository,
      permissionVerifier,
      hashGenerator,
    )

    adminUser = makeUser()

    usersRepository.items.push(adminUser)
  })

  it('should be able to create a new user', async () => {
    const result = await sut.execute({
      changeById: adminUser.id.toString(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: usersRepository.items[1],
    })
  })

  it('should not be able to create an user with duplicated email', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
    })

    usersRepository.items.push(user)

    const result = await sut.execute({
      changeById: adminUser.id.toString(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should hash student password when creating', async () => {
    const result = await sut.execute({
      changeById: adminUser.id.toString(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await hashGenerator.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items[1].password_hash).toEqual(hashedPassword)
  })
})
