import crypto from 'node:crypto'

type PinType =
  | 'numeric'
  | 'num'
  | 'alphabetic'
  | 'alpha'
  | 'alphanumeric'
  | 'alphanum'
export function generateRandomPin(length: number = 10, type?: PinType) {
  const charSets = {
    numeric: '123456789',
    num: '123456789',
    alphabetic: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    alphanumeric:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    alphanum: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  }

  const charSet = type ? charSets[type] : charSets['numeric']
  const charSetLength = charSet.length
  let pin = ''

  while (pin.length < length) {
    const randomBytes = crypto.randomBytes(1)
    const randomValue = randomBytes[0]

    if (randomValue < charSetLength) {
      pin += charSet[randomValue]
    }
  }
  return pin
}

export function setPinExpiryDate(validityPeriod: string) {
  const [n, t] = validityPeriod.split(' ')
  const num = parseInt(n, 10)
  let multiplier

  if (t.includes('minute')) {
    multiplier = 60 * 1000 // Minutes to milliseconds
  } else if (t.includes('hour')) {
    multiplier = 60 * 60 * 1000 // Hours to milliseconds
  } else {
    throw new Error(
      "Invalid time unit. Only 'minutes' or 'hours' are supported."
    )
  }

  const expiryTime = Date.now() + num * multiplier
  return new Date(expiryTime)
}

export function isPinExpired(expiryTime: string | Date) {
  const currentTime = Date.now()
  return new Date(currentTime) > new Date(expiryTime)
}
