var totaler = function(index, options) {
  var total = 0;
  for (var i = 0; i < index.length; i++) {
    if (typeof index[i] === "String") {
      total += Number(index[i]);
    } else {
      total += index[i];
    }
  }
  return total;
};

module.exports = totaler;
