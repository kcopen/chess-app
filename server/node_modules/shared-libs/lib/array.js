const shuffle = (value) => {

  let currentindex = value.length, temporaryValue, randomindex;

  // While there remain elements to shuffle...
  while (0 !== currentindex) {

    // Pick a remaining element...
    randomindex = Math.floor(Math.random() * currentindex);
    currentindex -= 1;

    // And swap it with the current element.
    temporaryValue = value[currentindex];
    value[currentindex] = value[randomindex];
    value[randomindex] = temporaryValue;
  }

  return value;
}

module.exports = {
  shuffle
}
