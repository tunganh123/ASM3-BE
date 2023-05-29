const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new Schema({
  useridorder: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  infoorder: {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
    },
  ],
  timeorder: {
    type: Date,
    required: true,
  },
  totalprice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("order", orderSchema);
