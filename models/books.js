import { DataTypes } from 'sequelize'
import sequelize from './dev.js'
import Club from './club.js'

const Book = sequelize.define('Book', {
    title: {type: DataTypes.STRING, allowNull: false},
    clubId: {type: DataTypes.INTEGER, references: {model: Club, key: 'id'}}
})

Club.hasMany(Book, { foreignKey: 'clubId'});
Book.belongsTo(Club, {foreignKey: 'clubId'});

export default Book;