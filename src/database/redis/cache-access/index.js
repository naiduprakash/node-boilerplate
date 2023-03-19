class CacheAccess {
	get = (key) => {
		return DBConnections.redis.get(key).then((data) => JSON.parse(data));
	};

	set = (key, data) => {
		const expiry = 12 * 60 * 60; // 12h
		return DBConnections.redis.setex(key, expiry, JSON.stringify(data));
	};

	del = (key) => {
		return DBConnections.redis.del(key);
	};

	clear = () => {
		return DBConnections.redis.flushdb();
	};
}

export default new CacheAccess();
