import Sequelize from "Sequelize";
import DBManager from "../helpers/db.js";
const db = new DBManager();

export const CrawlerModel = db.dbConnection.define('crawler', {
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
    maxDepth: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    maxTotalPages: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'crawler',
    timestamps: true,
    indexes: [{
            fields: ['URL']
        }],
});