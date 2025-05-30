import {runInAction, values} from "mobx";
import {type Instance, isAlive, types} from "mobx-state-tree";

const CoreModel = {};

const actions = (self: Instance<any>) => {
	return {
		create(changes: { id: string; [key: string]: any }) {
			if (!isAlive(self)) return;
			self.all.set(changes.id, changes);
		},

		update(updates: { [key: string]: any }) {
			if (!isAlive(self)) return;
			Object.keys(self).forEach(fieldName => {
				if (updates[fieldName] === undefined) return;
				runInAction(() => self[fieldName] = updates[fieldName]);
			});
		},

	};
};

const views = (self: Instance<any>) => {
	return {
		get list() {
			return self.all ? values(self.all) : [];
		},
	};
};

const volatile = () => {
	return {};
};

export default types.model("CoreModel", CoreModel).actions(actions).views(views).volatile(volatile);
