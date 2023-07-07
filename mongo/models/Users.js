const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  if (this.password) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

UserSchema.virtual("todos", {
  ref: "Todo",
  localField: "_id",
  foreignField: "user",
});

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;
