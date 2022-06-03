const { boolean } = require('../../../index')

test('boolean deve conter um propriedade chamada convertToBoolean', () => {
  expect(boolean).toHaveProperty('convertToBoolean')
})

test('boolean deve conter uma propriedade chamada convertToBoolean do tipo function', () => {
  const { convertToBoolean } = boolean
  expect(typeof convertToBoolean).toBe('function')
})

test('quando for enviado a string com a palavra true retornar o valor booleano true', () => {
  const booleano = boolean.convertToBoolean('true')
  expect(booleano).toBe(true)
})

test('quando for enviado a string com a palavra false retornar o valor booleano false', () => {
  const booleano = boolean.convertToBoolean('false')
  expect(booleano).toBe(false)
})

test('quando for enviado a string com a palavra TRUE retornar o valor booleano true', () => {
  const booleano = boolean.convertToBoolean('TRUE')
  expect(booleano).toBe(true)
})

test('quando for enviado a string com a palavra FALSE retornar o valor booleano FALSE', () => {
  const booleano = boolean.convertToBoolean('FALSE')
  expect(booleano).toBe(false)
})

test('quando for enviado a string HAHAHA retornar o valor booleano false', () => {
  const booleano = boolean.convertToBoolean('HAHAHA')
  expect(booleano).toBe(false)
})