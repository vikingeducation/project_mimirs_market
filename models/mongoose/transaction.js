const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({}, { strict: false });

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
