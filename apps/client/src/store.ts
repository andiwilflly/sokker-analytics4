import RootModel from "@/models/Root.model";
import type { Instance } from "mobx-state-tree";

const store: Instance<typeof RootModel> = RootModel.create({
	transfers: {
		grid: {},
		filters: {},
	},
});

export default store;
