import RootModel from "@/models/Root.model.ts";

const store = RootModel.create({
	transfers: {
		grid: {},
		filters: {},
		data: {},
	},
});

export default store;
