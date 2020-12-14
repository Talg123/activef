import Sequelize from "Sequelize";
import DBManager from "../helpers/db.js";
const db = new DBManager();

export const PagesModel = db.dbConnection.define('pages', {
    ID: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.UUIDV4
    },
    URL: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    depth: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false   
    },
    title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    links: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'pages',
    timestamps: true,
    indexes: [{
            fields: ['URL']
        }],
});