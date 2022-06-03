const fromString = (value) => {

  if(value === '\n' || isNaN(value)) return 0

  return parseInt(value, 10)
}

module.exports = {
  fromString
}