import Select from "@/components/elements/Select.component.js";
import store from "@/store.js";
import i18n from "@/translations/i18n.js";
import countries from "@shared/utils/countries.util.js";
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
			</>
		);
	}
}

export default observer(LangSelector);
