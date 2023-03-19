import { pbkdf2Sync } from 'crypto';

import { decryptText, encryptText, pkeAlgo, pkeSaltLength, salt2iterations } from '../utils/pkelib';

const mp = process.env.MP || 'МР';
const ms = process.env.MS || 'МS';

export default function user(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    priority: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    email2: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(15),
    },
    phone2: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 255],
      },
    },
    role: {
      type: DataTypes.STRING(15),
    },
    descript: {
      type: DataTypes.TEXT,
    },
  }, { underscored: true });

  User.associate = models => {
    User.hasMany(models.Folder, { onDelete: 'CASCADE' });
    User.hasMany(models.Message /* , { onDelete: 'CASCADE' } */);
  };

  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { username: login },
    });

    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }

    return user;
  };

  User.beforeCreate(async user => {
    user.password = await user.generatePasswordHash();
  });

  User.prototype.generatePasswordHash = async function(pass = this.password) {
    return await encryptText(pass, mp, ms, Buffer.alloc(12, mp), 32, 'chacha20-poly1305');
  };

  User.prototype.validatePassword = async function(password, salt) {
    const pass = pbkdf2Sync(
      await decryptText(this.password, mp, ms, Buffer.alloc(12, mp), 32, 'chacha20-poly1305'),
      salt,
      salt2iterations(salt),
      pkeSaltLength(),
      pkeAlgo()
    ).toString('hex');
    // console.log("zv pp:",pass, password, pass === password);
    return pass === password;
  };

  User.prototype.validatePasswordHash = async function(password) {
    return (password === this.password);
  };

  return User;
};

