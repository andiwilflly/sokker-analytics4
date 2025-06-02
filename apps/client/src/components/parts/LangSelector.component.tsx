import Select from "@/components/elements/Select.component.js";
import store from "@/store.js";
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
					options={countries.map(({ name, countryCode, icon }) => ({
						value: countryCode,
						label: `${icon} ${name}`,
					}))}
				/>
			</>
		);
	}
}

export default observer(LangSelector);
