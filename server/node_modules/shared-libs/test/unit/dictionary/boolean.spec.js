const { boolean } = require('../../../dictionary')

test('boolean deve ter uma propriedade chamada true', () => {
  expect(boolean).toHaveProperty('true')
})

test('boolean deve ter uma propriedade chamada false', () => {
  expect(boolean).toHaveProperty('false')
})

test('quando chamar a função true de boolean deve retornar valor booleano true', () => {
  const booleanTrue = boolean['true']()
  expect(booleanTrue).toBe(true)
})

test('quando chamar a função false de boolean deve retornar valor booleano false', () => {
  const booleanTrue = boolean['false']()
  expect(booleanTrue).toBe(false)
})