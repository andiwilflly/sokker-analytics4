import CoreModel from "@/models/Core.model";
import GridItemModel from "@/models/transfers/grid/GridItem.model";
import { chartTypes } from "@shared/schema/charts.schema";
import { type Instance, type SnapshotIn, applySnapshot, getSnapshot, types } from "mobx-state-tree";
import type { Layout } from "react-grid-layout";

const GridModel = types.compose(
	"GridModel",
	CoreModel,
	types.model({
		all: types.optional(types.map(GridItemModel), {}),
	}),
);

const actions = (self: Instance<typeof GridModel>) => {
	return {
		createItem(item: ITransferGridItemModelArguments) {
			self.all.set(item.i, item);
		},

		removeItem(i: string) {
			self.all.delete(i);
		},

		update(items: Layout[]) {
			items.forEach(item => {
				const itemModel = self.all.get(item.i);
				// if (itemModel) return itemModel.update(item);
				const newItemArguments: ITransferGridItemModelArguments = {
					i: item.i,
					x: item.x,
					w: item.w,
					h: item.h,
					chartType: itemModel?.chartType || chartTypes[0],
					selectedX: itemModel?.selectedX || "country",
					selectedY: (itemModel?.selectedY ? itemModel.selectedY.slice() : ["count"]) as Array<keyof ITransferStatBlockValues>,
				};
				this.removeItem(item.i); // Now we can remove item
				this.createItem(newItemArguments);
			});
			window.localStorage.setItem("transfers:grid", JSON.stringify(getSnapshot(self)));
		},

		// Hooks
		afterCreate() {
			try {
				const items = JSON.parse(window.localStorage.getItem("transfers:grid")!) as SnapshotIn<typeof GridModel>;
				applySnapshot(self, items);
			} catch (e: any) {
				console.warn(`transfers grid | Error: ${e.toString()}`);
			}
		},
	};
};

const views = (self: Instance<typeof GridModel>) => {
	return {
		get layout(): Layout[] {
			return self.list.map((item: Instance<typeof GridItemModel>, i) => ({
				i: item.i,
				x: item.x,
				y: i * 2,
				w: item.w,
				h: item.h,
				minH: item.minH,
				minW: item.minW,
			}));
		},
	};
};

const volatile = () => {
	return {
		generateId(): string {
			return `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
		},
	};
};

export default GridModel.actions(actions).views(views).volatile(volatile);
