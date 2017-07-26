import {
  Selector
} from 'testcafe'

fixture('signin')
  .page `http://localhost:3000/signin`

const idInput = Selector('#userId')
const passwordInput = Selector('#password')
const submitButton = Selector('button').nth(0)

test('sign in form validation', async t => {
  await t
    .click(submitButton)
    .expect(Selector('.error-text').exists).ok('Validation failed')
})

test('sign in success', async t => {
  await t
    .typeText(idInput, 'admin@system.com')
    .setTestSpeed(0.1)
    .expect(idInput.value).contains('admin@system.com')

  await t
    .typeText(passwordInput, 'admin')
    .setTestSpeed(0.1)
    .expect(passwordInput.value).contains('admin')

  await t
    .click(submitButton)
    .expect(Selector('.menu-node').exists).ok('Login failed!')
})

test('sign in failure', async t => {
  await t
    .typeText(idInput, 'admin@system.com')
    .setTestSpeed(0.1)
    .expect(idInput.value).contains('admin@system.com')

  await t
    .typeText(passwordInput, 'invalid-pass')
    .setTestSpeed(0.1)
    .expect(passwordInput.value).contains('invalid-pass')

  await t
    .click(submitButton)
    .expect(Selector('.menu-node').exists).notOk('Login did not fail!')
})