const moment = require('moment')
moment.locale('pt-BR')

module.exports = {
  'Ontem': () => moment().subtract(1, 'days').format('DD/MM/YYYY'),
  'Hoje': () => moment().format('DD/MM/YYYY'),
  'Amanhã': () => moment().add(1, 'days').format('DD/MM/YYYY')
}