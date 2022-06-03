const { regexPattern } = require('../dictionary/')

const match = (patternName, value) => {
  const matcher = new RegExp(regexPattern[patternName])
  return matcher.test(value)
}

module.exports = {
  match
}