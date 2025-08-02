import { makeUser } from '../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../test/repositories/in-memory-users-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { UserUnauthorizedError } from '../errors/user-unauthorized-error'
import { PermissionVerifier } from './permission-verifier'

let usersRepository: InMemoryUsersRepository
let sut: PermissionVerifier

describe('Permission Verifier', () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new PermissionVerifier(usersRepository)
  })

  it('should return error for invalid user', async () => {
    const result = await sut.verify('invalid-id')
    expect(result).toBeInstanceOf(UserNotFoundError)
  })

  it('should return error for non admin user', async () => {
    const nonAdminUser = makeUser({
      level: 'DEFAULT',
    })

    usersRepository.items.push(nonAdminUser)

    const result = await sut.verify(nonAdminUser.id.toString())

    expect(result).toBeInstanceOf(UserUnauthorizedError)
  })

  it('should return none for admin user', async () => {
    const adminUser = makeUser({
      level: 'ADMIN',
    })

    usersRepository.items.push(adminUser)

    const result = await sut.verify(adminUser.id.toString())

    expect(result).toBeNull()
  })
})
