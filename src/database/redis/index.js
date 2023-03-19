import Redis from "ioredis";
import dotEnv from "dotenv";

class dbConn {
	constructor() {
		dotEnv.config();
	}

	connect = () => {
		const config = {
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
			password: process.env.REDIS_PASSWORD,
			retryStrategy(times) {
				if (times > 20) return null; // return null to stop retrying
				return Math.min(times * 200, 2000);
			},
		};

		const client = new Redis(config);

		return new Promise((resolve, reject) => {
			client.on("connecting", () => {
				// eslint-disable-next-line no-console
				console.log("REDIS-connection: Connecting");
			});
			client.on("error", (err) => {
				// eslint-disable-next-line no-console
				console.log("REDIS-connection: Failed");
				reject(err);
			});
			client.on("connect", () => {
				// eslint-disable-next-line no-console
				console.log("REDIS-connection: Connected");
				resolve(client);
			});
		});
	};
}

export default new dbConn();
