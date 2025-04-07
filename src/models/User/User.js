const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      minlength: 4,
    },
    joinedGroupList: [
      {
        type: Number,
        ref: "Group",
      },
    ],
    maxStreak: {
      type: Number,
      default: 0,
    },
    initialStreak: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    initialSolved: {
      type: Number,
      default: 0,
    },
    currentSolved: {
      type: Number,
      default: 0,
    },
    tier: {
      type: Number,
      default: 0,
    },
    imgSrc: {
      type: String,
    },
    token: {
      type: String,
    },
    verificationCode: {
      type: String,
    },
    isVerified: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

// 비밀번호 해싱
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 비밀번호 비교
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// 토큰 생성
userSchema.methods.generateToken = async function () {
  this.token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "14d",
  });
  return this.save();
};

// 토큰 검증
userSchema.statics.findByToken = function (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.findOne({ _id: decoded._id, token });
  } catch (error) {
    return null;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
