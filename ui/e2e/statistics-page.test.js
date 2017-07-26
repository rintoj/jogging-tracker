import {
  Selector,
  login
} from './test-util'

fixture('Statistics Page')
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

test('should statistics of the current user', async(t) => {
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

  await t.click(Selector('.statistics-node'))
    .expect(Selector('.statistics-page').exists).ok()

  const titles = await Selector('.f2')
  await t.expect(titles.nth(0).innerText).contains('0.0014 %')
    .expect(titles.nth(1).innerText).contains('2016 Dec 09')
    .expect(titles.nth(2).innerText).contains('5.53 km')
    .expect(titles.nth(3).innerText).contains('5:41 hrs')
    .expect(Selector('select').count).eql(3)
    .expect(Selector('option').count).eql(10)

  // remove the entry just made & check
  await removeAll(t)
})