$(document).ready(() => {
  const prices = getPrices();

  for (let price of prices) {
    $("select#minPrice").append($('<option>', {
      value: price,
      text: `$${ price }`
    }));

    $("select#maxPrice").append($('<option>', {
      value: price,
      text: `$${ price }`
    }));
  }
});

function getPrices() {
  let prices = ['0'];

  for (let i = 10; i <= 100; i += 10) {
    prices.push(`${ i }.00`);
  }

  for (let i = 150; i <= 1000; i += 50 ) {
    prices.push(`${ i }.00`);
  }
  return prices;
}
