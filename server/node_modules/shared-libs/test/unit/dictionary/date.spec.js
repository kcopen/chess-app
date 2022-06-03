const { date } = require('../../../dictionary')

test('date deve ter uma propriedade chamada Ontem', () => {
  expect(date).toHaveProperty('Ontem')
})

test('date deve ter uma propriedade chamada Hoje', () => {
  expect(date).toHaveProperty('Hoje')
})

test('date deve ter uma propriedade chamada Amanhã', () => {
  expect(date).toHaveProperty('Amanhã')
})