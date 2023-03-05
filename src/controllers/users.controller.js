import createHttpError from "http-errors";
import usersProvider from "../providers/users.provider";

class UsersController {
	fetchUsers = (req, res, next) => {
		const {
			query: filters,
			params: { id },
		} = req;

		return usersProvider
			.getUsers({ filters, id })
			.then((data) => {
				if (id && data.data.length == 0) {
					throw createHttpError(404);
				} else if (id) {
					return res.status(200).send(data.data[0]);
				}
				return res.status(200).send(data);
			})
			.catch(next);
	};
}

export default new UsersController();
