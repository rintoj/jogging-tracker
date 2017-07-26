import {
  Selector
} from 'testcafe'

fixture('Sign Up Page')
  .page `http://localhost:5000/signup`

const idInput = Selector('#userId')
const nameInput = Selector('#name')
const passwordInput = Selector('#password')
const confirmInput = Selector('#confirm')
const submitButton = Selector('button').nth(0)
const cancelButton = Selector('button').nth(1)

test('should show validation errors if incorrect values are entered', async t => {
  await t.click(submitButton)
    .expect(Selector('.error-text').nth(0).innerText).eql('Required')
    .expect(Selector('.error-text').nth(1).innerText).eql('Required')
    .expect(Selector('.error-text').nth(2).innerText).eql('Required')
    .expect(Selector('.error-text').nth(3).innerText).eql('Required')
})

test('should not allow invalid email as user id', async t => {
  await t.typeText(idInput, 'test-user')
  await t.click(submitButton)
    .expect(Selector('.error-text').nth(0).innerText).eql('Invalid email')
})

test('should show "password do not match" error if confirmation is incorrect', async t => {
  await t.typeText(idInput, 'test-user@system.com')
  await t.typeText(nameInput, 'New User')
  await t.typeText(passwordInput, 'test@123')
  await t.typeText(confirmInput, 'test')
  await t.click(submitButton)
    .expect(Selector('.error-text').nth(3).innerText).eql('Don\'t match!')
})

test('should successfully create a user if validation is successful', async t => {
  const id = Math.random().toString().substr(-6)
  await t.typeText(idInput, `test-user-${id}@system.com`)
  await t.typeText(nameInput, 'New User')
  await t.typeText(passwordInput, 'test@123')
  await t.typeText(confirmInput, 'test@123')
  await t.click(submitButton)
    .expect(Selector('.f2').innerText).eql('User is registered')
})

test('should navigate to signup page if signup button is clicked', async t => {
  await t.click(cancelButton)
    .expect(Selector('.title-text').exists).ok()
})