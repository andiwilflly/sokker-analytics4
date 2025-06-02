import { observer } from "mobx-react";
import React from "react";

interface IProps {
	label?: React.ReactNode;
	options: { value: number | string; label: React.ReactNode }[];
	value: string | readonly string[] | number;
	onChange: (e: any) => void;
	className?: string;
	style?: React.CSSProperties;
	isMulti?: boolean;
}

class Select extends React.Component<IProps> {
	static defaultProps: {
		label: "";
		isMulti: false;
		className: "";
		style: {};
	};

	render() {
		return (
			<>
				{this.props.label ? <label className="block text-sm font-medium text-gray-700 mb-1">{this.props.label}</label> : null}
				<select
					style={this.props.style}
					multiple={this.props.isMulti}
					value={this.props.value}
					onChange={this.props.onChange}
					className={`bg-[#8f8fea] text-[white] p-1 outline-0 block w-full rounded-sm ${this.props.className}`}>
					{this.props.options.map((option, i) => {
						return (
							<option key={i} value={option.value}>
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
