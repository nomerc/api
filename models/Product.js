const mongoose = require("mongoose");

var ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
