import RootModel from "@/models/Root.model.ts";
import type { Instance } from "mobx-state-tree";

const store: Instance<typeof RootModel> = RootModel.create({
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
