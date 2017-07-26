import {
  Selector,
  login
} from './test-util'

fixture('User Page')
  .page `http://localhost:3000/signin`

async function openPage(t) {
  await t.click(Selector('.manage-users-node'))
    .expect(Selector('.users-page').exists).ok()
  const createButton = await Selector('button').nth(1)
  const searchInput = await Selector('input')
  return {
    createButton,
    searchInput
  }
}

test('should allow an admin to add a user and remove', async t => {
  await login(t)
  const page = await openPage(t)

  await t.click(page.createButton)
    .expect(Selector('.user-form').exists).ok()

  const inputs = await Selector('input')
  const id = Math.random().toString().substr(-6)

  await t.click(Selector('button').nth(1))
    .expect(Selector('.error-text').nth(0).innerText).eql('Required')
    .expect(Selector('.error-text').nth(1).innerText).eql('Required')
    .typeText(inputs.nth(0), `z-user-${id}@gmail.com`)
    .typeText(inputs.nth(1), `Aaaa ${id}`)
    .typeText(inputs.nth(2), 'test@123')
    .typeText(Selector('select'), 'admin')
    .pressKey('down down enter')
    .click(Selector('button').nth(1))
    .expect(Selector('.user-form').exists).notOk()
    .expect(Selector('td').withText(`z-user-${id}@gmail.com`).exists).ok()
    .click(Selector('.fa.fa-times-circle').nth(0))
    .expect(Selector('td').withText(`z-user-${id}@gmail.com`).exists).notOk()
})

test('should allow user to search by name', async t => {
  await login(t)
  const page = await openPage(t)

  await t.typeText(page.searchInput, 'ad')
    .expect(Selector('tr').count).eql(2)
    .expect(Selector('td').withText('NO RECORDS').exists).notOk()
    .typeText(page.searchInput, 'john doe', {
      replace: true
    })
    .expect(Selector('tr').count).eql(2)
    .expect(Selector('td').withText('NO RECORDS').exists).notOk()
    .typeText(page.searchInput, 'ann', {
      replace: true
    })
    .expect(Selector('tr').count).eql(2)
    .expect(Selector('td').withText('NO RECORDS').exists).notOk()
})