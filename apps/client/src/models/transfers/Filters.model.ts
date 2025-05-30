import CoreModel from "@/models/Core.model.ts";
import { type Instance, type SnapshotIn, applySnapshot, getSnapshot, isAlive, types } from "mobx-state-tree";

const FiltersModel = types.compose(
	"FiltersModel",
	CoreModel,
	types.model({
		fromMs: types.optional(types.number, 0),
		toMs: types.optional(types.number, () => Date.now()),

		minSS: types.optional(types.number, 0),
		maxSS: types.optional(types.number, 100),

		minPrice: types.optional(types.number, 0),
		maxPrice: types.optional(types.number, 46875000), // e.g., 300M UAH

		selectedAges: types.optional(types.array(types.number), [22, 30]),
		selectedCountries: types.optional(types.array(types.number), [22, 1]),
	}),
);

const actions = (self: Instance<typeof FiltersModel>) => {
	return {
		update(updates: Partial<IFilters>) {
			if (!isAlive(self)) return;

			for (const key in updates) {
				const typedKey = key as keyof IFilters;
				if (updates[typedKey] !== undefined && key in self) {
					(self as any)[key] = updates[typedKey];
				}
			}

			// Save LS
			window.localStorage.setItem("transfers:filters", JSON.stringify(getSnapshot(self)));
		},

		reset() {
			Object.assign(self, getSnapshot(FiltersModel.create())); // Reset to model defaults
		},

		// Hooks
		afterCreate() {
			try {
				const filtersLS = JSON.parse(window.localStorage.getItem("transfers:filters") || "") as SnapshotIn<typeof FiltersModel>;
				applySnapshot(self, filtersLS);
			} catch (e) {
				console.warn(e);
			}
		},
	};
};

const views = (self: Instance<typeof FiltersModel>) => {
	return {
		get all() {
			return getSnapshot(self) as IFilters;
		},
		get names() {
			return Object.keys(getSnapshot(self)) as (keyof IFilters)[];
		},
	};
};

const volatile = () => {
	return {
		agesList: Array.from({ length: 40 - 16 + 1 }, (_, i) => 16 + i),
	};
};

export default FiltersModel.actions(actions).views(views).volatile(volatile);
