export function paginate(resultset = {}, params = {}) {
	const { rows = [], count } = resultset;
	const { page, limit } = params;
	return {
		paging: {
			total: count,
			page_no: Number(page) < 1 ? 1 : Number(page),
			page_length: rows.length,
			page_limit: Number(limit),
		},
		data: rows,
	};
}
