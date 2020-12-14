import Sequelize from "Sequelize";

const DEFAULT_CONNECTION = {
    database: 'activefence',
    username: 'user',
    password: 'password',
    port: 3307,
    
}

export default class DBManager {
    static dbConnection = null;
    constructor() {
        this.init();
    }

    init(){
        if (this.dbConnection) return;
        const sequelize = new Sequelize.Sequelize({
            dialect: 'mysql',
            logging: true,
            host: '127.0.0.1',
            ...DEFAULT_CONNECTION
        });
        sequelize.authenticate().then(async () => {
            try {
                await sequelize.sync();                    
            } catch (error) {
                console.error(error);
                process.exit(1);
            }
        }).catch(err => {
            console.error(err);
            process.exit(1);
        });
        this.dbConnection = sequelize;
    }
}