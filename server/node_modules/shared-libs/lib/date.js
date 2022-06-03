const moment = require('moment')
moment.locale('pt-BR')

const { date: convert } = require('../dictionary')

const convertToDate = (value) => {
  const getDate = convert[value]
  return getDate ? getDate() : 'Invalid format'
}

module.exports = {
  convertToDate
}