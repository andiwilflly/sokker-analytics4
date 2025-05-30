import React from "react";

interface IProps {
	className?: string;
}

class PreLoader extends React.Component<IProps> {
	static defaultProps = {
		className: "",
	};

	render() {
		return (
			<div
				className={`w-8 h-8 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin ${this.props.className}`}></div>
		);
	}
}

export default PreLoader;
