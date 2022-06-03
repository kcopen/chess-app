const { string } = require('../../../index')

test('string deve conter um propriedade chamada match', () => {
  expect(string).toHaveProperty('match')
});

test('string deve conter uma propriedade chamada string do tipo function', () => {
  const { match } = string
  expect(typeof match).toBe('function')
})

test('deve retornar true ao enviar DD/MM/YYYY e a data 25/01/2018', () => {
  const valueMathes = string.match('DD/MM/YYYY', '25/01/2018')
  expect(valueMathes).toBe(true)
})

test('deve retornar false ao enviar DD/MM/YYYY e a data 2018-01-01', () => {
  const valueMathes = string.match('DD/MM/YYYY', '2018-01-01')
  expect(valueMathes).toBe(false)
})

test('deve retornar false ao enviar DD/MM/YYYY e a data 2018-01-01', () => {
  const valueMathes = string.match('DD/MM/YYYY', '2018-01-01')
  expect(valueMathes).toBe(false)
})

test('deve retornar false ao enviar DD/MM/YYYY e a string SHOULD NOT MATCH', () => {
  const valueMathes = string.match('DD/MM/YYYY', 'SHOULD NOT MATCH')
  expect(valueMathes).toBe(false)
})