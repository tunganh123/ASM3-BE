const { Schema, model } = require("mongoose");
const sessionSchema = new Schema({
  session: {
    type: String,
    required: true,
  },
  user: {
    type: String,
  },
  message: { type: Array },
});

module.exports = model("session", sessionSchema);
