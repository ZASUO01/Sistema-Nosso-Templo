import { HashGenerator } from '../../criptography/hash-generator'

export class FakeHashGenerator implements HashGenerator {
  async hash(plain: string) {
    return plain.concat('-hashed')
  }
}
