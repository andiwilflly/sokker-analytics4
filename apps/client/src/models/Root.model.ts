import CoreModel from "@/models/Core.model.ts";
import TransfersModel from "@/models/transfers/Transfers.model.ts";
import i18n from "@/translations/i18n.ts";
import { TLang } from "@shared/schema/basic.schema.js";
import { reaction, toJS } from "mobx";
import { type Instance, addDisposer, types } from "mobx-state-tree";

const RootModel = types.compose(
	"RootModel",
	CoreModel,
	types.model({
		IS_APP_READY: types.optional(types.boolean, false),
		isLoading: types.optional(types.boolean, false),
		lang: types.optional(types.union(types.literal("en"), types.literal("uk")), "en"),
		transfers: TransfersModel,
	}),
);

const actions = (self: Instance<typeof RootModel>) => {
	return {
		async setup() {
			console.time("✅ APP | init");

			const { data, error } = await self.transfers.worker.init();
			if (error) console.log("❌ APP | init error: ", error);

			self.transfers.update({ fromMs: data!.fromMs, toMs: data!.toMs });
			await this.prepareTransfers(); // Use this inside other actions to call sibling actions.

			self.update({ IS_APP_READY: true });
			console.timeEnd("✅ APP | init");
		},

		setLang(lang: TLang) {
			i18n.locale(lang);
			self.update({ lang });
		},

		async prepareTransfers() {
			self.update({ isLoading: true });
			const transfersPrepare = await self.transfers.worker.filter(toJS(self.transfers.filters.all));
			if (transfersPrepare.error) {
				console.log("❌ APP | filter error: ", transfersPrepare.error);
				self.update({ isLoading: false });
				return;
			}

			self.transfers.update({ data: transfersPrepare.data });
			self.update({ isLoading: false });
		},

		// Hooks
		async afterCreate() {
			await this.setup();

			addDisposer(
				self,
				reaction(
					() => JSON.stringify(self.transfers.filters.all),
					() => self.update({ isLoading: true }),
					{ delay: 0 },
				),
			);

			addDisposer(
				self,
				reaction(() => JSON.stringify(self.transfers.filters.all), this.prepareTransfers, { delay: 700 }),
			);
		},
	};
};

const views = () => {
	return {};
};

const volatile = () => {
	return {};
};

export default RootModel.actions(actions).views(views).volatile(volatile);
