import CoreModel from "@/models/Core.model";
import { type ISearch } from "@server/schema/advancedSearch.schema";
import { type Instance, type SnapshotIn, applySnapshot, getSnapshot, isAlive, types } from "mobx-state-tree";

const SkillType = (min: number, max: number) => {
	return types.refinement(types.number, val => val >= min && val <= max);
};

const SearchModel = types.compose(
	"SearchModel",
	CoreModel,
	types.model({
		name: types.optional(types.string, ""),
		fromMs: types.optional(types.number, 0),
		toMs: types.optional(types.number, 0),
		age: types.optional(types.array(SkillType(16, 40)), [16, 40]),
		stamina: types.optional(types.array(SkillType(0, 11)), [0, 11]),
		keeper: types.optional(types.array(SkillType(0, 18)), [0, 18]),
		pace: types.optional(types.array(SkillType(0, 18)), [0, 18]),
		defender: types.optional(types.array(SkillType(0, 18)), [0, 18]),
		technique: types.optional(types.array(SkillType(0, 18)), [0, 18]),
		playmaker: types.optional(types.array(SkillType(0, 18)), [0, 18]),
		passing: types.optional(types.array(SkillType(0, 18)), [0, 18]),
		striker: types.optional(types.array(SkillType(0, 18)), [0, 18]),
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
				const searchLS = JSON.parse(window.localStorage.getItem("transfers:search") || "") as SnapshotIn<typeof SearchModel>;
				if (searchLS) applySnapshot(self, searchLS);
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
