import T from "@/components/T.component.tsx";
import SearchSchema from "@shared/schema/advancedSearch.schema.ts";
import { observer } from "mobx-react";
import React from "react";

interface IProps {}

class TransfersAdvancedSearch extends React.Component<IProps> {
	form = {};

	onSubmit(e: any) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const rawData = Object.fromEntries(formData.entries());

		const { error, data } = SearchSchema.safeParse(rawData);
		if (error) console.error("Validation errors:", error.flatten().fieldErrors);

		console.log(data);
	}

	render() {
		return (
			<>
				<form className="grid grid-cols-2 gap-4" onSubmit={this.onSubmit}>
					<div className="w-full">
						<label htmlFor="name">Name</label>
						<input id="name" name="name" type="text" />
					</div>

					<div>
						<label htmlFor="age">Age</label>
						<input id="age" name="age" type="number" min="0" />
					</div>

					<div>
						<label htmlFor="stamina">Stamina</label>
						<input id="stamina" name="stamina" type="text" />
					</div>

					<div>
						<label htmlFor="keeper">Keeper</label>
						<input id="keeper" name="keeper" type="text" />
					</div>

					<div>
						<label htmlFor="pace">Pace</label>
						<input id="pace" name="pace" type="text" />
					</div>

					<div>
						<label htmlFor="defender">Defender</label>
						<input id="defender" name="defender" type="text" />
					</div>

					<div>
						<label htmlFor="technique">Technique</label>
						<input id="technique" name="technique" type="text" />
					</div>

					<div>
						<label htmlFor="playmaker">Playmaker</label>
						<input id="playmaker" name="playmaker" type="text" />
					</div>

					<div>
						<label htmlFor="passing">Passing</label>
						<input id="passing" name="passing" type="text" />
					</div>

					<div>
						<label htmlFor="striker">Striker</label>
						<input id="striker" name="striker" type="text" />
					</div>

					<button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-4 rounded">
						<T>Search</T>
					</button>
				</form>
			</>
		);
	}
}

export default observer(TransfersAdvancedSearch);
