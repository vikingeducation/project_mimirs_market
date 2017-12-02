const ViewHelper = {};

ViewHelper.displayPrice = (price) => {
  return parseFloat(price).toFixed(2);
}

module.exports = ViewHelper;
