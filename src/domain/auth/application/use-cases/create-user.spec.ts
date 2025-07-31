import { FakeHashGenerator } from '../../test/criptography/fake-hash-generator'
import { InMemoryUsersRepository } from '../../test/repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'

let usersRepository: InMemoryUsersRepository
let hashGenerator: FakeHashGenerator
let sut: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    hashGenerator = new FakeHashGenerator()
    sut = new CreateUserUseCase(usersRepository, hashGenerator)
  })

  it('should be able to create a new user', async () => {
    const result = await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: usersRepository.items[0],
    })
  })
})
