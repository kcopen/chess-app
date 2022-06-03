const moment = require('moment')
moment.locale('pt-BR')

const { date } = require('../../../index')

test('date deve conter um propriedade chamada convertToDate', () => {
  expect(date).toHaveProperty('convertToDate')
})

test('date deve conter uma propriedade chamada convertToDate do tipo function', () => {
  const { convertToDate } = date
  expect(typeof convertToDate).toBe('function')
})

test('quando for enviado a string com a palavra Ontem retornar a date de ontem no formato DD/MM/YYYY', () => {
  const data = date.convertToDate('Ontem')
  const expectedDate = moment().subtract(1, 'days').format('DD/MM/YYYY')
  expect(data).toBe(expectedDate)
})

test('quando for enviado a string com a palavra Hoje retornar a date de hoje no formato DD/MM/YYYY', () => {
  const data = date.convertToDate('Hoje')
  const expectedDate = moment().format('DD/MM/YYYY')
  expect(data).toBe(expectedDate)
})

test('quando for enviado a string com a palavra Amanhã retornar a date de amanhã no formato DD/MM/YYYY', () => {
  const data = date.convertToDate('Amanhã')
  const expectedDate = moment().add(1, 'days').format('DD/MM/YYYY')
  expect(data).toBe(expectedDate)
})

test('quando for enviado a string diferente de Ontem, Hoje ou Amanhã, retornar a string Invalid format', () => {
  const data = date.convertToDate('TESTE')
  expect(data).toEqual('Invalid format')
})
