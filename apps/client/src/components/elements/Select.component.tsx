import { observer } from "mobx-react";
import React from "react";

interface IProps {
	label: React.ReactNode;
	options: { value: number | string; label: React.ReactNode }[];
	value: string | readonly string[] | number;
	onChange: (e: any) => void;
	style?: React.CSSProperties;
	isMulti?: boolean;
}

class Select extends React.Component<IProps> {
	static defaultProps: {
		isMulti: false;
		style: {};
	};

	render() {
		return (
			<>
				<label className="block text-sm font-medium text-gray-700 mb-1">{this.props.label}</label>
				<select
					style={this.props.style}
					multiple={this.props.isMulti}
					value={this.props.value}
					onChange={this.props.onChange}
					className="bg-[#8f8fea] text-[white] p-1 outline-0 block w-full mt-1 rounded-sm">
					{this.props.options.map(option => {
						return (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						);
					})}
				</select>
			</>
		);
	}
}

export default observer(Select);
