import { DataTypes } from 'sequelize'
import sequelize  from './dev.js';

const Club = sequelize.define('Club', {
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: true}
})

export default Club