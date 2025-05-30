import { observer } from "mobx-react";
import RcSlider from "rc-slider";
import React from "react";
import "rc-slider/assets/index.css";

interface IProps {
	min: number;
	max: number;
	values: number[];
	onChange: (values: number | number[]) => void;
	step?: number;
}

class Slider extends React.Component<IProps> {
	static defaultProps = {
		step: 0.1,
	};

	render() {
		const { min, max, values, onChange, step } = this.props;

		return (
			<>
				<RcSlider
					range
					min={min}
					max={max}
					step={step}
					value={values}
					onChange={onChange}
					styles={{
						track: {
							backgroundColor: "#8f8fea",
							height: 6,
						},
						handle: {
							height: 12,
							width: 12,
							opacity: 1,
							backgroundColor: "#8f8fea",
							border: "none",
							marginTop: -3,
							borderRadius: 6,
						},
						rail: {
							backgroundColor: "#ccc",
							height: 6,
						},
					}}
				/>
			</>
		);
	}
}

export default observer(Slider);
