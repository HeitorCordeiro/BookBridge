import { Sequelize }from 'sequelize'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: "./database.sqlite"
});

sequelize.sync({ force: true })

export default sequelize