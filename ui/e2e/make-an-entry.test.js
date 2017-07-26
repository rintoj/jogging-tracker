import {
  Selector,
  login
} from './test-util'

fixture('Make an entry dialog')
  .page `http://localhost:3000/signin`

async function openPage(t, type) {
  await login(t, type)
  await t.click(Selector('.make-an-entry-btn'))
    .expect(Selector('.make-an-entry-dialog').exists).ok()
  const inputs = Selector('.make-an-entry-dialog input')
  const buttons = Selector('.make-an-entry-dialog button')
  return {
    date: inputs.nth(0),
    distance: inputs.nth(1),
    hour: inputs.nth(2),
    minute: inputs.nth(3),
    submit: buttons.nth(0),
    cancel: buttons.nth(1)
  }
}

test('should show validation errors if user clicks Create button when input fields are invalid', async t => {
  const page = await openPage(t)
  await t.click(page.submit)
    .expect(Selector('.error-text').nth(0)).eql('Required')
    .expect(Selector('.error-text').nth(1)).eql('Required')
    .expect(Selector('.error-text').nth(2)).eql('Required')
})