let body = {
  fname: "Jada",
  lname: "Zboncak",
  email: "Dario.Hansen@yahoo.com",
  street: "94873 Juston Prairie",
  city: "Port Adolphus",
  zip: "72927-1049",
  state: "33",
  stripeToken: "tok_1AplMaJFybyO5hohIewXpzzm",
  stripeTokenType: "card",
  stripeEmail: "dario.hansen@yahoo.com"
};

let session = {
  cart: {
    "1": {
      count: 1,
      product: {
        prettyPrice: "$218.00",
        prettyDate: "8/10/2017",
        id: 1,
        sku: "6e46eae0-3416-4983-9552-ebff3d012199",
        name: "Fantastic Concrete Salad",
        description:
          "Dolorem numquam incidunt quis.\nNostrum quia quis nihil dolores quo repellendus.\nFacere exercitationem aut impedit voluptas maxime dolores nesciunt est.\nProvident rerum ratione occaecati praesentium.\nPraesentium ea dolores voluptatem quia est occaecati consequatur repellat sequi.\nAut non sit enim quia ex.",
        price: 218,
        CategoryId: 2,
        createdAt: "2017-08-11T00:49:50.169Z",
        updatedAt: "2017-08-11T00:49:50.169Z",
        Category: {
          id: 2,
          name: "Sleek Small Unbranded",
          createdAt: "2017-08-11T00:49:50.021Z",
          updatedAt: "2017-08-11T00:49:50.021Z"
        },
        count: 1,
        subtotal: "$218.00"
      }
    }
  }
};

let response = {
  id: "ch_1AplMdJFybyO5hohnPGayV13",
  object: "charge",
  amount: 1524,
  amount_refunded: 0,
  application: null,
  application_fee: null,
  balance_transaction: "txn_1AplMdJFybyO5hohnCoNAwpu",
  captured: true,
  created: 1502489539,
  currency: "usd",
  customer: null,
  description: "Mimir is pleased!",
  destination: null,
  dispute: null,
  failure_code: null,
  failure_message: null,
  fraud_details: {},
  invoice: null,
  livemode: false,
  metadata: {},
  on_behalf_of: null,
  order: null,
  outcome: {
    network_status: "approved_by_network",
    reason: null,
    risk_level: "normal",
    seller_message: "Payment complete.",
    type: "authorized"
  },
  paid: true,
  receipt_email: null,
  receipt_number: null,
  refunded: false,
  refunds: {
    object: "list",
    data: [],
    has_more: false,
    total_count: 0,
    url: "/v1/charges/ch_1AplMdJFybyO5hohnPGayV13/refunds"
  },
  review: null,
  shipping: null,
  source: {
    id: "card_1AplMaJFybyO5hohIqSKgrmK",
    object: "card",
    address_city: null,
    address_country: null,
    address_line1: null,
    address_line1_check: null,
    address_line2: null,
    address_state: null,
    address_zip: null,
    address_zip_check: null,
    brand: "Visa",
    country: "US",
    customer: null,
    cvc_check: "pass",
    dynamic_last4: null,
    exp_month: 1,
    exp_year: 2018,
    fingerprint: "preWK8dOeqHCTodg",
    funding: "credit",
    last4: "4242",
    metadata: {},
    name: "dario.hansen@yahoo.com",
    tokenization_method: null
  },
  source_transfer: null,
  statement_descriptor: null,
  status: "succeeded",
  transfer_group: null
};
