import DataTypes from 'sequelize';
import sequelize  from './dev.js';

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }
});

export default User;