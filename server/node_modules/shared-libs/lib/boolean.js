const { boolean: convert } = require('../dictionary')

const convertToBoolean = (value) => {
  const getBoolean = convert[value.toLowerCase()]
  return getBoolean ? getBoolean() : false
}

module.exports = {
  convertToBoolean
}