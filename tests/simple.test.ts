import { expect, test } from 'vitest'

const user = {
  name: 'John',
  age: 30,
}

test('John is 30', () => {
  expect(user.name).toBe('John')
  expect(user.age).toBe(30)
})
