const { Schema, model } = require("mongoose");

const ledgerSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "Book",
  },
  lender: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
  borrower: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
  lendDate: {
    type: Date,
  },
  returnDate: {
    type: Date,
  },
});

const Ledger = model("Ledger", ledgerSchema);

module.exports = Ledger;
