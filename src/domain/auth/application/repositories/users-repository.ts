// import { UniqueEntityID } from '@/modules/core/entities/unique-entity-id'
import { User } from '../../enterprise/user'

export interface Params {
  page: number
}

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  // findMany(params: Params): Promise<User[]>
  create(user: User): Promise<void>
  // save(user: User): Promise<void>
  // deleteById(id: UniqueEntityID): Promise<void>
}
