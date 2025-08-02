import { UniqueEntityID } from '@/domain/core/entities/unique-entity-id'
import { User, UserProps } from '../../enterprise/user'
import { faker } from '@faker-js/faker'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password_hash: faker.internet.password(),
      level: 'ADMIN',
      status: 'ACTIVE',
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return user
}
