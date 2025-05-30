import RootModel from "@/models/Root.model.ts";

const store = RootModel.create({
	transfers: {
		grid: {},
		filters: {},
		data: {
			country: { labels: [], values: {} },
			height: { labels: [], values: {} },
			weekday: { labels: [], values: {} },
			count: 0,
		},
	},
});

export default store;
