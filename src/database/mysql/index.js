import Sequelize from "sequelize";
import dotEnv from "dotenv";
import usersModel from "./models/users";
class DBConn {
	constructor() {
		dotEnv.config();
		Sequelize.DataTypes.DATE.prototype._stringify = function _stringify(
			date,
			options
		) {
			date = this._applyTimezone(date, options);
			return date.format("YYYY-MM-DD HH:mm:ss.SSS");
		};
	}

	connect = async () => {
		const conf = {
			host: process.env.MYSQL_HOST,
			dialect: process.env.MYSQL_DIALECT,
			logging: false,
			query: { nest: true },
			hooks: {
				beforeBulkCreate(_, options) {
					options.individualHooks = true;
				},
				beforeBulkUpdate(options) {
					options.individualHooks = true;
				},
				beforeBulkDestroy(options) {
					options.individualHooks = true;
				},
			},
		};
		const sequelize = new Sequelize(
			process.env.MYSQL_DATABASE,
			process.env.MYSQL_USERNAME,
			process.env.MYSQL_PASSWORD,
			conf
		);
		const database = {
			models: {
				users: usersModel(sequelize),
			},
		};

		Object.keys(database.models).forEach((modelName) => {
			if (database.models[modelName].associate) {
				database.models[modelName].associate(database.models);
			}
		});
		database.sequelize = sequelize;
		database.Sequelize = Sequelize;

		await database.sequelize.authenticate();
		return database;
	};
}

export default new DBConn();
