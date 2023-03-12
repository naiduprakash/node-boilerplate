import bodyParser from "body-parser";
import cors from "cors";
import dotEnv from "dotenv";
import express from "express";
import http from "http";
import nocache from "nocache";
import path from "path";
import mysqlDB from "./src/database/mysql";

class App {
	constructor() {
		dotEnv.config();

		// eslint-disable-next-line no-console
		console.log("1. Establish Database Connections.");
		this.connectDatabases()
			.then((DBConnections) => {
				// eslint-disable-next-line no-console
				console.log("2. Configure Express Server.");
				return this.configureExpressServer(DBConnections);
			})
			.then((app) => {
				// eslint-disable-next-line no-console
				console.log("3. Attach Error Handlers.");

				return this.attachErrorHandlers(app);
			})
			.then((app) => {
				// eslint-disable-next-line no-console
				console.log("4. Start Server.");
				return this.startServer(app);
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log("API failed to initialize!");
				// eslint-disable-next-line no-console
				console.log(err);
			});
	}

	connectDatabases = async () => {
		const mysql = await mysqlDB.connect();
		// eslint-disable-next-line no-console
		console.log("MYSQL-connection has been established successfully.");

		return { mysql };
	};

	configureExpressServer = (DBConnections) => {
		return new Promise((resolve) => {
			const app = express();
			const routes = require("./src/routes").default;
			app.set("base", process.env.API_zPREFIX);
			app.use(cors()); // enable cors
			app.use(nocache()); // prevent default server-cache
			app.use(express.json({ limit: "10mb" })); // set default response-type to json
			app.use(express.urlencoded({ extended: true }));
			app.use(bodyParser.urlencoded({ extended: false }));
			app.use(express.static(path.join(__dirname, "public")));
			app.use(`/${process.env.API_PREFIX}`, routes);

			// global vars
			global.DBConnections = DBConnections;
			global.rootDir = path.resolve(__dirname);

			resolve(app);
		});
	};

	attachErrorHandlers = (app) => {
		return new Promise((resolve) => {
			// 404
			// eslint-disable-next-line unused-imports/no-unused-vars
			app.use((req, res, next) => {
				return res.status(404).send({
					error: `Not found: ${req.url}`,
				});
			});
			// 500
			// eslint-disable-next-line unused-imports/no-unused-vars
			app.use((err, req, res, next) => {
				// eslint-disable-next-line no-console
				console.log("err", err); // write to pm2 logs
				const statusCode = err.status || 500;
				const { message, ...rest } = err;
				const dbError = (rest.errors || []).map((item) => item.message);
				let error = null;
				if (dbError.length > 0) {
					error = { error: dbError };
				} else {
					error = Object.keys(rest).length && err.status ? rest : { error: message };
				}
				return res.status(statusCode).send(error);
			});

			resolve(app);
		});
	};

	startServer = (app) => {
		return new Promise((resolve) => {
			// set port
			const port = process.env.PORT;
			app.set("port", port);
			// create HTTP server
			const server = http.createServer(app);
			// attach handler
			server.on("listening", () => {
				const bind = server.address().port;
				// eslint-disable-next-line no-console
				console.log("API listening on " + `[ http://localhost:${bind}/${process.env.API_PREFIX}/ ]`);
				resolve(server);
			});
			// listen on provided port, on all network interfaces
			server.listen(port);
		});
	};
}

export default new App();
