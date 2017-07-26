import {
  Selector
} from 'testcafe'

fixture('signin')
  .page `http://localhost:3000/signin`

const idInput = Selector('#userId')
const passwordInput = Selector('#password')
const submitButton = Selector('button').nth(0)
const signupButton = Selector('button').nth(1)

test('should show validation errors if incorrect values are entered', async t => {
  await t.click(submitButton)
    .expect(Selector('.error-text').nth(0).innerText).eql('Required')
    .expect(Selector('.error-text').nth(1).innerText).eql('Required')
})

test('should successfully validate user id and password and navigate to home page', async t => {
  await t.typeText(idInput, 'admin@system.com')
  await t.typeText(passwordInput, 'admin')
  await t.click(submitButton)
    .expect(Selector('.menu-node').exists).ok('Login failed!')
})

test('should validate user and should not navigate to home page if fails', async t => {
  await t.typeText(idInput, 'admin@system.com')
  await t.typeText(passwordInput, 'invalid-pass')
  await t.click(submitButton)
    .expect(Selector('.menu-node').exists).notOk('Login did not fail!')
})

test('should navigate to signup page if signup button is clicked', async t => {
  await t.click(signupButton)
    .expect(Selector('.f2.mb4').exists).ok('Navigation to signup page failed!')
})