import _ from "lodash";

export default function sortingParams(params = "") {
	return _.split(params, ",").map((item) => _.split(item, ":"));
}
