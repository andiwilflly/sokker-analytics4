import CoreModel from "@/models/Core.model.ts";
import TransfersModel from "@/models/transfers/Transfers.model.ts";
import i18n from "@/translations/i18n.ts";
import { type TCurrency, type TLang } from "@shared/schema/basic.schema.ts";
import { type IWorkerAPI, type TWorkerProgress } from "@shared/schema/worker.schema.js";
import countries, { currencyMapping } from "@shared/utils/countries.util.js";
import { formatPriceUAH } from "@shared/utils/formatPrice.utils.js";
import * as Comlink from "comlink";
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

			// Listen to rawWorker's messages
			self.transfers.rawWorker.addEventListener("message", event => {
				if (event.data?.type === "transfers:progress") {
					const { total, loaded, progress } = event.data.payload as TWorkerProgress;
					console.log(`📥 Progress: ${progress}% (${loaded} / ${total})`);
					self.update({
						loading: {
							total,
							loaded,
							progress,
						},
					});
				}
			});

			// Create comlink worker
			self.transfers.update({
				worker: Comlink.wrap<IWorkerAPI>(self.transfers.rawWorker),
			});

			const { data, error } = await self.transfers.worker.init();
			if (error) console.log("❌ APP | init error: ", error);

			// Filters
			if (self.transfers.filters.fromMs === 0) self.transfers.filters.update({ fromMs: data!.fromMs });
			if (self.transfers.filters.toMs === 0) self.transfers.filters.update({ toMs: data!.toMs });

			// Transfers
			self.transfers.update({ fromMs: data!.fromMs, toMs: data!.toMs });
			await this.prepareTransfers(); // Use this inside other actions to call sibling actions.

			// Set lang/currency
			const lang = window.localStorage.getItem("app:lang") || self.lang;
			const currency = window.localStorage.getItem("app:currency") || self.currency;
			this.setLang(lang as TLang);
			this.setCurrency(currency as TCurrency);

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

			// CACHE [currencyCountry]
			const countryCode = Object.keys(currencyMapping).find(countryCode => {
				const countryCodeTyped = countryCode as keyof typeof currencyMapping;
				const { currency } = currencyMapping[countryCodeTyped];
				return currency === self.currency;
			}) as keyof typeof currencyMapping;
			const currencyCountry = countries.find(country => country.countryCode === countryCode)!;

			self.update({ currencyCountry });

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
	};
};

const volatile = () => {
	return {
		loading: {
			progress: 0,
			total: 0,
			loaded: 0,
		} as TWorkerProgress,
		currencyCountry: {} as (typeof countries)[number],

		formatPrice(value: number) {
			return new Intl.NumberFormat(currencyMapping[this.currencyCountry.countryCode].locale, {
				style: "currency",
				currency: currencyMapping[this.currencyCountry.countryCode].currency,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}).format(value / this.currencyCountry.rate);
		},
	};
};

// @ts-ignore
export default RootModel.actions(actions).views(views).volatile(volatile);
