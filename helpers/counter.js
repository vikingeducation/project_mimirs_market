var counter = function(index, options) {
  var total = 0;
  for (var i = 0; i < index.length; i++) {
    total += index[i];
  }
  return total;
};

module.exports = counter;
