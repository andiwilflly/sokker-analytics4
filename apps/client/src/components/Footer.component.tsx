import React from "react";

interface IProps {}

class Footer extends React.Component<IProps> {
	static defaultProps = {};

	render() {
		return (
			<footer className="shadow-md px-4 py-2 w-screen flex items-center justify-between">
				<div className="text-xs text-gray-500">
					Transfers made during the period:&nbsp;
					<span className="text-green-400!">
						{new Date().toLocaleDateString()}&nbsp;-&nbsp;
						{new Date().toLocaleDateString()}
					</span>
					<br />
					Data sourced from the&nbsp;
					<a className="underline!" href="https://geston.smallhost.pl/sokker/scouting.php" target="_blank">
						Mikoos database
					</a>
				</div>
				<div className="text-xs text-gray-500">
					Original database by:&nbsp;
					<a className="underline!" href="https://sokker.org/en/app/team/16334/" target="_blank">
						Mikoos
					</a>
					<br />
					Author:&nbsp;
					<a className="underline!" href="https://sokker.org/en/app/team/75331/" target="_blank">
						andiwillfly
					</a>
				</div>
			</footer>
		);
	}
}

export default Footer;
