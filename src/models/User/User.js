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
    initial: {
      bronze: {
        type: Number,
        default: 0,
      },
      silver: {
        type: Number,
        default: 0,
      },
      gold: {
        type: Number,
        default: 0,
      },
      platinum: {
        type: Number,
        default: 0,
      },
      diamond: {
        type: Number,
        default: 0,
      },
      ruby: {
        type: Number,
        default: 0,
      },
    },
    current: {
      bronze: {
        type: Number,
        default: 0,
      },
      silver: {
        type: Number,
        default: 0,
      },
      gold: {
        type: Number,
        default: 0,
      },
      platinum: {
        type: Number,
        default: 0,
      },
      diamond: {
        type: Number,
        default: 0,
      },
      ruby: {
        type: Number,
        default: 0,
      },
    },
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
    initialCount: {
      type: Number,
      default: 0,
    },
    currentCount: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    count: {
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
  },
  { timestamps: true }
);

userSchema.index({ score: -1 });
userSchema.index({ maxStreak: -1 });

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
userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "365d",
  });
};

// 토큰 검증
userSchema.statics.findByToken = function (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.findById(decoded._id);
  } catch (error) {
    return null;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
