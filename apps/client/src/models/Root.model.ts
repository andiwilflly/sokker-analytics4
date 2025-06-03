import CoreModel from "@/models/Core.model.ts";
import TransfersModel from "@/models/transfers/Transfers.model.ts";
import i18n from "@/translations/i18n.ts";
import { type TCurrency, type TLang } from "@shared/schema/basic.schema.ts";
import countries, { currencyMapping } from "@shared/utils/countries.util.js";
import { reaction, toJS } from "mobx";
import { type Instance, addDisposer, types } from "mobx-state-tree";

const RootModel = types.compose(
	"RootModel",
	CoreModel,
	types.model({
		IS_APP_READY: types.optional(types.boolean, false),
		isLoading: types.optional(types.boolean, false),
		lang: types.optional(types.enumeration(countries.map(({ countryCode }) => countryCode)), "uk"),
		currency: types.optional(types.enumeration(Object.values(currencyMapping).map(({ currency }) => currency)), "UAH"),
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

			// Set lang/currency
			const lang = window.localStorage.getItem("app:lang");
			const currency = window.localStorage.getItem("app:currency");
			if (lang) this.setLang(lang as TLang);
			if (currency) this.setCurrency(currency as TCurrency);

			self.update({ IS_APP_READY: true });
			console.timeEnd("✅ APP | init");
		},

		setLang(lang: TLang) {
			i18n.locale(lang);
			const currency = currencyMapping[lang].currency;
			self.update({ lang, currency });
			window.localStorage.setItem("app:lang", lang);
			window.localStorage.setItem("app:currency", currency);
		},

		setCurrency(currency: TCurrency) {
			self.update({ currency });
			window.localStorage.setItem("app:currency", currency);
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

const views = (self: Instance<typeof RootModel>) => {
	return {
		get country() {
			return countries.find(({ countryCode }) => countryCode === self.lang)!;
		},
		get currencyCountry() {
			const countryCode = Object.keys(currencyMapping).find(countryCode => {
				const countryCodeTyped = countryCode as keyof typeof currencyMapping;
				const { currency } = currencyMapping[countryCodeTyped];
				return currency === self.currency;
			}) as keyof typeof currencyMapping;
			return countries.find(country => country.countryCode === countryCode)!;
		},
	};
};

const volatile = () => {
	return {};
};

// @ts-ignore
export default RootModel.actions(actions).views(views).volatile(volatile);
