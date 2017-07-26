import {
  Selector,
  login
} from './test-util'

const moment = require('moment')

fixture('Log Entires Page')
  .page `http://localhost:3000/signin`

async function selectPage() {
  const inputs = await Selector('.make-an-entry-dialog input')
  const buttons = await Selector('.make-an-entry-dialog button')
  return {
    date: inputs.nth(0),
    distance: inputs.nth(1),
    hour: inputs.nth(2),
    minute: inputs.nth(3),
    submit: buttons.nth(0),
    cancel: buttons.nth(1)
  }
}

async function openPage(t) {
  await t.click(Selector('.make-an-entry-btn'))
    .expect(Selector('.make-an-entry-dialog').exists).ok()
  return await selectPage()
}

async function ensureOrder(t, rows) {
  const trs = await Selector('tr')
  for (let i = 0; i < rows.length; i++) {
    const rowText = trs.nth(i + 1).innerText
    await t.expect(rowText).contains(moment(rows[i][0]).format('MMMM DD, YYYY'))
      .expect(rowText).contains(rows[i][1])
      .expect(rowText).contains(rows[i][2])
      .expect(rowText).contains(rows[i][3])
  }
}

export async function makeAnEntry(t, date, distance, hour, minute) {

  const page = await openPage(t)

  // make an entry
  await t.typeText(page.date, date)
    .expect(page.date.value).eql(date)
    .typeText(page.distance, distance)
    .expect(page.distance.value).eql(distance)
    .typeText(page.hour, hour)
    .expect(page.hour.value).eql(hour)
    .typeText(page.minute, minute)
    .expect(page.minute.value).eql(minute)
    .click(page.submit)
    .expect(Selector('.make-an-entry-dialog').exists).notOk()
}

export async function removeAll(t) {
  await t.click(Selector('.log-entries-node'))
  let next = await Selector('tr').nth(1).innerText !== 'NO RECORDS'
  while (next) {
    await t.click(Selector('.fa-times-circle'))
    next = await Selector('tr').nth(1).innerText !== 'NO RECORDS'
  }
  await t.expect(Selector('tr').nth(1).innerText).contains('NO RECORDS')
}

test('should show validation errors if user clicks Create button when input fields are invalid', async t => {
  await login(t)
  const page = await openPage(t)
  await t.click(page.submit)
    .expect(Selector('.error-text').nth(0).innerText).eql('Required')
    .expect(Selector('.error-text').nth(1).innerText).eql('Required')
    .expect(Selector('.error-text').nth(2).innerText).eql('Required')

  await t.typeText(page.distance, '-1')
    .expect(page.distance.value).eql('-1')

  await t.click(page.submit)
    .expect(Selector('.error-text').nth(1).innerText).eql('Invalid distance')
})

test('should make an entry if the form is valid and user clicks create button', async(t) => {
  await login(t)
  await removeAll(t)
  await makeAnEntry(t, '2017-03-12', '1.45', '1', '25')

  // check for the entry just made in log entries table
  await t.click(Selector('.log-entries-node'))
  const rows = Selector('tr')
  await t.expect(rows.nth(1).innerText).contains('March 12, 2017')
    .expect(rows.nth(1).innerText).contains('1.45 km')
    .expect(rows.nth(1).innerText).contains('01:25')
    .expect(rows.nth(1).innerText).contains('1.02 km/h')

  // remove the entry just made & check
  await t.click(Selector('.fa-times-circle').nth(0))
    .expect(Selector('tr').nth(1).innerText).contains('NO RECORDS')
})

test('should make multiple entries and remove all of them', async(t) => {
  await login(t)
  await removeAll(t)
  await makeAnEntry(t, '2017-03-12', '1.45', '1', '25')
  await makeAnEntry(t, '2017-03-12', '1.45', '1', '25')
  await makeAnEntry(t, '2017-03-12', '1.45', '1', '25')
  await makeAnEntry(t, '2017-03-12', '1.45', '1', '25')

  // remove the entry just made & check
  await removeAll(t)
})

test('should allow user to edit an item previously entered', async(t) => {
  await login(t)
  await removeAll(t)
  await makeAnEntry(t, '2017-03-12', '1.45', '1', '25')

  await t.click(Selector('tr').nth(1))
  const page = await selectPage()
  await t.typeText(page.date, '2017-03-13')
    .expect(page.date.value).eql('2017-03-13')
    .typeText(page.distance, '1.46', {
      replace: true
    })
    .expect(page.distance.value).eql('1.46')
    .typeText(page.minute, '58', {
      replace: true
    })
    .expect(page.minute.value).eql('58')
    .click(page.submit)
    .expect(Selector('.make-an-entry-dialog').exists).notOk()

  const rows = Selector('tr')
  await t.expect(rows.nth(1).innerText).contains('March 13, 2017')
    .expect(rows.nth(1).innerText).contains('1.46 km')
    .expect(rows.nth(1).innerText).contains('01:58')
    .expect(rows.nth(1).innerText).contains('0.74 km/h')

  // remove the entry just made & check
  await removeAll(t)
})

test('should allow user to make multiple entries and to sort by each column', async(t) => {
  await login(t)
  await removeAll(t)
  const rows = [
    ['2017-03-12', '1.45', '1', '12'],
    ['2016-12-09', '2.45', '0', '58'],
    ['2017-02-28', '1.18', '1', '19'],
    ['2017-01-03', '0.45', '2', '12']
  ]

  for (let i = 0; i < rows.length; i++)
    await makeAnEntry(t, rows[i][0], rows[i][1], rows[i][2], rows[i][3])

  await ensureOrder(t, [].concat(rows).sort((a, b) => new Date(b[0]) - new Date(a[0])))

  const heads = await Selector('th')

  await t.click(heads.nth(3))
  await ensureOrder(t, [].concat(rows).sort((a, b) => a[1] - b[1]))
  await t.click(heads.nth(3))
  await ensureOrder(t, [].concat(rows).sort((a, b) => b[1] - a[1]))

  await t.click(heads.nth(4))
  await ensureOrder(t, [].concat(rows).sort((a, b) => a[2] - b[2]))

  // remove the entry just made & check
  await removeAll(t)
})

test('should allow user to filter the items by date', async(t) => {
  await login(t)
  await removeAll(t)
  const rows = [
    ['2017-03-12', '1.45', '1', '12'],
    ['2016-12-09', '2.45', '0', '58'],
    ['2017-02-28', '1.18', '1', '19'],
    ['2017-01-03', '0.45', '2', '12']
  ]

  for (let i = 0; i < rows.length; i++)
    await makeAnEntry(t, rows[i][0], rows[i][1], rows[i][2], rows[i][3])

  await ensureOrder(t, [].concat(rows).sort((a, b) => new Date(b[0]) - new Date(a[0])))

  const inputs = await Selector('.log-page input')
  await t.click(Selector('.log-page .root'))
    .typeText(inputs.nth(0), '2017-01-02')
    .expect(Selector('tr').count).eql(4)
    .typeText(inputs.nth(1), '2017-02-28')
    .expect(Selector('tr').count).eql(3)

  // remove the entry just made & check
  await removeAll(t)
})