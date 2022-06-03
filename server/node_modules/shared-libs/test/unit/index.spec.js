const index = require('../../index')

test('index deve ser um objeto', () => {
  expect(typeof index).toBe('object')
})

test('index deve conter uma propriedade chamada integer', () => {
  expect(index).toHaveProperty('integer')
})

test('index deve conter uma propriedade chamada date', () => {
  expect(index).toHaveProperty('date')
})

test('index deve conter uma propriedade chamada boolean', () => {
  expect(index).toHaveProperty('boolean')
})

test('index deve conter uma propriedade chamada array', () => {
  expect(index).toHaveProperty('array')
})

test('index deve conter uma propriedade chamada integer do tipo function', () => {
  const { integer } = index
  expect(typeof integer).toBe('object')
})

test('index deve conter uma propriedade chamada date do tipo function', () => {
  const { date } = index
  expect(typeof date).toBe('object')
})

test('index deve conter uma propriedade chamada boolean do tipo function', () => {
  const { boolean } = index
  expect(typeof boolean).toBe('object')
})

test('index deve conter uma propriedade chamada array do tipo function', () => {
  const { array } = index
  expect(typeof array).toBe('object')
})