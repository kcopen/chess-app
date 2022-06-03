const { array } = require('../../../index')

test('array deve conter um propriedade chamada shuffle', () => {
  expect(array).toHaveProperty('shuffle')
})

test('array deve conter uma propriedade chamada shuffle do tipo function', () => {
  const { shuffle } = array
  expect(typeof shuffle).toBe('function')
})

test('array deve retornar um array com os mesmos valores enviados porém em posições aleatórias diferentes', () => {
  const items = [ 1, 2, 3, 4, 5 ]
  const sortedArray = array.shuffle(items)
  items.forEach(item => {
    const expectedItem = sortedArray.filter(expected => expected === item)
    expect(expectedItem).toHaveLength(1)
  })
})

test('array deve retornar um array com a mesma quantidade de posições do array enviado', () => {
  const items = [ 1, 2, 3, 4, 5 ]
  const sortedArray = array.shuffle(items)
  expect(sortedArray).toHaveLength(items.length)
})