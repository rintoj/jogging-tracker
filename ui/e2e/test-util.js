import {
  Selector as TestCafeSelector
} from 'testcafe'

const users = {
  admin: {
    id: 'admin@system.com',
    password: 'admin'
  },
  manager: {
    id: 'john@gmail.com',
    password: 'test@123'
  },
  user: {
    id: 'anna@gmail.com',
    password: 'test@123'
  }
}

export const Selector = TestCafeSelector

export async function login(t, type) {
  type = type || 'admin'
  const idInput = Selector('#userId')
  const passwordInput = Selector('#password')
  const submitButton = Selector('button').nth(0)
  await t.typeText(idInput, users[type].id)
  await t.typeText(passwordInput, users[type].password)
  await t.click(submitButton)
    .expect(Selector('.menu-node').exists).ok('Login failed!')
}