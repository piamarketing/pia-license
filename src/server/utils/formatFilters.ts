const formatFilters = (filters: any) => {
	if (filters['filters']) {
		filters = JSON.parse(filters['filters']);
	}

	// Take a look at all the filters or their childrens are empty and remove them with their parents

	const removeEmptyFilters = (filters: any) => {
		for (const key in filters) {
			if (filters[key] === '') {
				delete filters[key];
			} else if (typeof filters[key] === 'object') {
				removeEmptyFilters(filters[key]);
			}
		}
	};

	removeEmptyFilters(filters);

	console.log(filters);

	return filters;
};

export default formatFilters;
