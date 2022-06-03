const { integer } = require('../../../index')

test('Integer deve conter um propriedade chamada fromString', () => {
  expect(integer).toHaveProperty('fromString')
});

test('Integer deve conter uma propriedade chamada fromString do tipo function', () => {
  const { fromString } = integer
  expect(typeof fromString).toBe('function')
})

test('quando enviado a string contendo o número 1, deve retornar o valor inteiro 1', () => {
  const value = integer.fromString('1')
  expect(value).toBe(1)
})

test('quando enviado a string contendo o número 2, deve retornar o valor inteiro 2', () => {
  const value = integer.fromString('2')
  expect(value).toBe(2)
})

test('quando enviado a string contendo o número 3, deve retornar o valor inteiro 3', () => {
  const value = integer.fromString('3')
  expect(value).toBe(3)
})

test('quando enviado a string contendo o número 4, deve retornar o valor inteiro 4', () => {
  const value = integer.fromString('4')
  expect(value).toBe(4)
})

test('quando enviado a string contendo @, deve retornar o valor inteiro 0', () => {
  const value = integer.fromString('@')
  expect(value).toBe(0)
})

test('quando enviado a string contendo -, deve retornar o valor inteiro -', () => {
  const value = integer.fromString('-')
  expect(value).toBe(0)
})

test('quando enviado a string contendo true, deve retornar o valor inteiro 0', () => {
  const value = integer.fromString('true')
  expect(value).toBe(0)
})

test('quando enviado a string contendo \n, deve retornar o valor inteiro 0', () => {
  const value = integer.fromString('\n')
  expect(value).toBe(0)
})