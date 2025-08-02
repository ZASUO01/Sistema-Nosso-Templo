import { HashComparer } from '../../criptography/hash-comparer'

export class FakeHashComparer implements HashComparer {
  async compare(plain: string, hash: string) {
    return plain.concat('-hashed') === hash
  }
}
