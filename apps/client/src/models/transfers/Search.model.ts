import CoreModel from "@/models/Core.model";
import { type ISearch } from "@shared/schema/advancedSearch.schema";
import { type Instance, type SnapshotIn, applySnapshot, getSnapshot, isAlive, types } from "mobx-state-tree";

const SkillType = types.union(
	types.literal("ALL"),
	types.refinement(types.number, val => val >= 0 && val <= 18),
);

const SearchModel = types.compose(
	"SearchModel",
	CoreModel,
	types.model({
		name: types.optional(types.string, "ALL"),
		age: types.optional(
			types.refinement(types.number, value => value === 0 || (value >= 16 && value <= 40)),
			0,
		),
		stamina: types.optional(types.string, "ALL"),
		keeper: types.optional(SkillType, "ALL"),
		pace: types.optional(SkillType, "ALL"),
		defender: types.optional(SkillType, "ALL"),
		technique: types.optional(SkillType, "ALL"),
		playmaker: types.optional(SkillType, "ALL"),
		passing: types.optional(SkillType, "ALL"),
		striker: types.optional(SkillType, "ALL"),
	}),
);

const actions = (self: Instance<typeof SearchModel>) => {
	return {
		update(updates: Partial<ISearch>) {
			if (!isAlive(self)) return;

			for (const key in updates) {
				const typedKey = key as keyof ISearch;
				if (updates[typedKey] !== undefined && key in self) {
					(self as any)[key] = updates[typedKey];
				}
			}

			// Save LS
			window.localStorage.setItem("transfers:search", JSON.stringify(getSnapshot(self)));
		},

		reset() {
			Object.assign(self, getSnapshot(SearchModel.create())); // Reset to model defaults
		},

		// Hooks
		afterCreate() {
			try {
				const filtersLS = JSON.parse(window.localStorage.getItem("transfers:search") || "") as SnapshotIn<typeof SearchModel>;
				applySnapshot(self, filtersLS);
			} catch (e) {
				console.warn(e);
			}
		},
	};
};

const views = () => {
	return {};
};

const volatile = () => {
	return {};
};

export default SearchModel.actions(actions).views(views).volatile(volatile);
