import PreLoader from "@/components/PreLoader.component.tsx";
import T from "@/components/T.component.tsx";
import TransfersAdvancedSearch from "@/components/transfers/TransfersAdvancedSearch.component";
import TransfersFilters from "@/components/transfers/TransfersFilters.component";
import store from "@/store.ts";
import { observer } from "mobx-react";
import React from "react";

interface IProps {}

class Sidebar extends React.Component<IProps> {
	static defaultProps = {};

	render() {
		return (
			<>
				<div className="filters p-2 relative">
					<div className=":bordered sticky p-3 top-[54px]">
						<div className="flex flex-col h-full w-full pt-2 pr-2">
							<div className="flex mb-2">
								<button
									className={`pb-2 cursor-pointer text-sm mr-4 font-medium border-b-2 ${
										!store.transfers.isAdvancedSearch
											? "border-violet-500 text-violet-600"
											: "text-gray-500 hover:text-gray-700 border-transparent"
									}`}
									onClick={() => {
										store.transfers.update({ isAdvancedSearch: false });
									}}>
									<T>Filters</T>
								</button>
								<button
									className={`pb-2 cursor-pointer text-sm font-medium border-b-2 ${
										store.transfers.isAdvancedSearch
											? "border-violet-500 text-violet-600"
											: "text-gray-500 hover:text-gray-700 border-transparent"
									}`}
									onClick={() => store.transfers.update({ isAdvancedSearch: true })}>
									<T>Advanced search</T>
								</button>
							</div>

							<div className="text-gray-500 text-xs mb-2">
								<T>Transfers found</T>:&nbsp;
								<span className="text-red-600">{store.transfers.data.count.toLocaleString()}</span>
							</div>

							{store.transfers.isAdvancedSearch ? <TransfersAdvancedSearch /> : <TransfersFilters />}
						</div>
					</div>

					{store.isLoading ? (
						<div className="absolute inset-0 flex items-center justify-center">
							<PreLoader />
						</div>
					) : null}
				</div>
			</>
		);
	}
}

export default observer(Sidebar);
