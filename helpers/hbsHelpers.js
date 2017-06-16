var hbsHelper = {};


hbsHelper.formatAsCurrency = function(number) {
  return ((number / 100)
    .toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    }));
};


module.exports = hbsHelper;
