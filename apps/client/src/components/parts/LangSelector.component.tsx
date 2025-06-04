import Select from "@/components/elements/Select.component";
import store from "@/store";
import i18n from "@/translations/i18n";
import countries, { currencyMapping } from "@shared/utils/countries.util.js";
import { observer } from "mobx-react";
import React from "react";

interface IProps {}

class LangSelector extends React.Component<IProps> {
	render() {
		return (
			<>
				<Select
					value={store.lang}
					style={{ width: 210 }}
					className="bg-red-400"
					onChange={(e: any) => {
						store.setLang(e.target.value);
					}}
					options={i18n.langs().map(lang => {
						const country = countries.find(({ countryCode }) => lang === countryCode);
						return {
							value: lang,
							label: `${country?.icon} ${country?.name}`,
						};
					})}
				/>

				<Select
					value={store.currency}
					style={{ width: 80 }}
					className="bg-orange-600 ml-1"
					onChange={(e: any) => {
						store.setCurrency(e.target.value);
					}}
					options={i18n.langs().map(lang => {
						const country = countries.find(({ countryCode }) => lang === countryCode);
						const { currency } = currencyMapping[country!.countryCode];
						return {
							value: currency,
							label: `${country?.icon} ${currency}`,
						};
					})}
				/>
			</>
		);
	}
}

export default observer(LangSelector);
