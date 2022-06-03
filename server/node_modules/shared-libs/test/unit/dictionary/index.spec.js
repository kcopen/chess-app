const index = require('../../../dictionary')

test('index deve ser um objeto', () => {
  expect(typeof index).toBe('object')
})

test('index deve conter uma propriedade chamada boolean', () => {
  expect(index).toHaveProperty('boolean')
})

test('index deve conter uma propriedade chamada date', () => {
  expect(index).toHaveProperty('date')
})

test('index deve conter uma propriedade chamada boolean do tipo object', () => {
  const { boolean } = index
  expect(typeof boolean).toBe('object')
})

test('index deve conter uma propriedade chamada date do tipo object', () => {
  const { date } = index
  expect(typeof date).toBe('object')
})