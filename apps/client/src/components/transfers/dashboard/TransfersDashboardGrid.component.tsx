import GridLayout, { type Layout, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { GRID_ITEM_MIN_HEIGHT } from "@/CONSTANTS.ts";
import T from "@/components/T.component.tsx";
import TransfersDashboardItem from "@/components/transfers/dashboard/TransfersDashboardItem.component.tsx";
import store from "@/store";
import { observer } from "mobx-react";
import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";

const ResponsiveGridLayout = WidthProvider(GridLayout);

interface IProps {}

class TransfersDashboardGrid extends React.Component<IProps> {
	onLayoutChange = (newItems: Layout[]) => {
		const sortedItems = newItems.toSorted((a, b) => a.y - b.y);
		store.transfers.grid.update(sortedItems);
	};

	onAddNewWidget = () => {
		store.transfers.grid.createItem({
			i: store.transfers.grid.generateId(),
			w: 12,
			h: GRID_ITEM_MIN_HEIGHT,
			x: Infinity,
			chartType: "line",
			selectedX: "country",
			selectedY: ["price_max", "price_min", "price_avg"],
		});
	};

	render() {
		return (
			<div className="z-10 relative :grid">
				<ResponsiveGridLayout
					draggableHandle=".\:grid-draggable-handler"
					style={store.transfers.grid.layout.length ? {} : { height: 0 }}
					onLayoutChange={this.onLayoutChange}
					layout={store.transfers.grid.layout}
					cols={12}
					margin={[10, 10]}
					containerPadding={[0, 0]}
					rowHeight={30}>
					{store.transfers.grid.layout.map(item => {
						return (
							<div key={item.i}>
								<AutoSizer>
									{({ width, height }) => <TransfersDashboardItem i={item.i} width={width} height={height} />}
								</AutoSizer>
							</div>
						);
					})}
				</ResponsiveGridLayout>

				{store.transfers.grid.layout.length ? null : (
					<div className="p-10 bg-gray-200 rounded text-gray-500 text-xs flex justify-center">
						<T>Add new widget to analyze transfers data</T>
					</div>
				)}

				<div className="flex justify-end mt-2 mb-2">
					<button className=":button" onClick={this.onAddNewWidget}>
						<T>Add new widget</T>
					</button>
				</div>
			</div>
		);
	}
}

// @ts-ignore
export default observer(TransfersDashboardGrid);
