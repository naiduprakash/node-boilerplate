export default function pagingParams(params) {
	const { page, limit } = params;
	return {
		offset: Number(page) < 1 ? 0 : (Number(page) - 1) * Number(limit),
		limit: Number(limit),
	};
}
