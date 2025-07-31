import { Entity } from '@/domain/core/entities/entity'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity-id'

export interface UserProps {
  firstName: string
  lastName: string
  nick: string | null
  password_hash: string
  email: string
}

export class User extends Entity<UserProps> {
  get email() {
    return this.props.email
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id)

    return user
  }
}
