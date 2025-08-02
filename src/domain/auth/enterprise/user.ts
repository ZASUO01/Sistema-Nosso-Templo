import { Entity } from '@/domain/core/entities/entity'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity-id'

export interface UserProps {
  firstName: string
  lastName: string
  nick?: string
  password_hash: string
  email: string
  phone?: string
  level: 'ADMIN' | 'DEFAULT'
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
  createdAt: Date
  updatedAt?: Date
}

export class User extends Entity<UserProps> {
  get firstName() {
    return this.props.firstName
  }

  get lastName() {
    return this.props.lastName
  }

  get nick(): string | undefined {
    return this.props.nick
  }

  get password_hash() {
    return this.props.password_hash
  }

  get email() {
    return this.props.email
  }

  get phone(): string | undefined {
    return this.props.phone
  }

  get level() {
    return this.props.level
  }

  get status(): 'ACTIVE' | 'INACTIVE' | 'BLOCKED' {
    return this.props.status
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  set firstName(firstName: string) {
    this.props.firstName = firstName
  }

  set lastName(lastName: string) {
    this.props.lastName = lastName
  }

  set nick(nick: string | undefined) {
    this.props.nick = nick
  }

  set phone(phone: string | undefined) {
    this.props.phone = phone
  }

  set status(status: 'ACTIVE' | 'INACTIVE') {
    this.props.status = status
  }

  set level(level: 'ADMIN' | 'DEFAULT') {
    this.props.level = level
  }

  set updatedAt(date: Date) {
    this.props.updatedAt = date
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id)

    return user
  }
}
