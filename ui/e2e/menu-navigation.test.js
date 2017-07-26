import {
  Selector
} from 'testcafe'

fixture('Main Menu')
  .page `http://localhost:3000/signin`

const idInput = Selector('#userId')
const passwordInput = Selector('#password')
const submitButton = Selector('button').nth(0)

async function login(t) {
  await t.typeText(idInput, 'admin@system.com')
  await t.typeText(passwordInput, 'admin')
  await t.click(submitButton)
    .expect(Selector('.menu-node').exists).ok('Login failed!')
}

test('should show profile page when user clicks on user profile at the top of the menu', async t => {
  await login(t)
  await t.click(Selector('.profile-node'))
    .expect(Selector('.profile-page').exists).ok()
})

test('should sign out a user when sign out button is clicked ', async t => {
  await login(t)
  await t.click(Selector('.sign-out-btn'))
    .expect(Selector('.sign-in-page').exists).ok()
})

test('should navigate to different menus as the navigation buttons are clicked', async t => {
  await login(t)
  await t.click(Selector('.log-entries-node'))
    .expect(Selector('.log-page').exists).ok()
  await t.click(Selector('.manage-users-node'))
    .expect(Selector('.users-page').exists).ok()
  await t.click(Selector('.statistics-node'))
    .expect(Selector('.statistics-page').exists).ok()
  await t.click(Selector('.make-an-entry-btn'))
    .expect(Selector('.make-an-entry-dialog').exists).ok()
})

test('should switch user when clicking a user profile from user list', async t => {
  await login(t)
  await t.click(Selector('.switch-button'))
    .expect(Selector('.switch-users-page').exists).ok()
  await t.click(Selector('.profile-node').nth(2))
    .expect(Selector('.selected-user-node .text-node').innerText).contains('ANNA HELEN')
})