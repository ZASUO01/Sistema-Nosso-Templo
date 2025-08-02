import { TokenGenerator } from '../../criptography/token-generator'

export class FakeTokenGenerator implements TokenGenerator {
  async generate(payload: Record<string, unknown>) {
    return JSON.stringify(payload)
  }
}
