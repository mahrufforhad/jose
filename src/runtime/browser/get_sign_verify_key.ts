import crypto, { isCryptoKey } from './webcrypto.js'
import { checkSigCryptoKey } from '../../lib/crypto_key.js'
import invalidKeyInput from '../../lib/invalid_key_input.js'

export default function getCryptoKey(alg: string, key: unknown, usage: KeyUsage) {
  if (isCryptoKey(key)) {
    checkSigCryptoKey(key, alg, usage)
    return key
  }

  if (key instanceof Uint8Array) {
    if (!alg.startsWith('HS')) {
      throw new TypeError(invalidKeyInput(key, 'CryptoKey'))
    }
    return crypto.subtle.importKey(
      'raw',
      key,
      { hash: `SHA-${alg.substr(-3)}`, name: 'HMAC' },
      false,
      [usage],
    )
  }

  throw new TypeError(invalidKeyInput(key, 'CryptoKey', 'Uint8Array'))
}
