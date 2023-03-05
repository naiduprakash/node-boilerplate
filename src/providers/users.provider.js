import _ from "lodash";
import Const from "../helpers/constants";
import { paginate } from "../utils/paginate";
import pagingParams from "../utils/paging-params";
import sortingParams from "../utils/sorting-params";

class UsersProvider {
	getUsers = ({ filters, id }) => {
		const {
			models,
			Sequelize: { Op },
		} = DBConnections.mysql;

		const { term = "", page = 0, limit = Const.PAGING.LIMIT, sort = "first_name:asc" } = filters || {};

		const order = sortingParams(sort);
		const paging = pagingParams({ page, limit });
		const where = {};

		if (!_.isEmpty(id)) {
			where.id = id;
		}

		if (!_.isEmpty(term)) {
			where[Op.or] = [
				{ username: { [Op.like]: `%${term}%` } },
				{ first_name: { [Op.like]: `%${term}%` } },
				{ middle_name: { [Op.like]: `%${term}%` } },
				{ last_name: { [Op.like]: `%${term}%` } },
			];
		}
		const query = { where, order, ...paging };
		return models.users.findAndCountAll(query).then((result) => paginate(result, { page, limit }));
	};
}

export default new UsersProvider();
