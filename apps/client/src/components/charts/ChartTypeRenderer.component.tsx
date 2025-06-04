import type GridItemModel from "@/models/transfers/grid/GridItem.model";
import store from "@/store";
import { observer } from "mobx-react";
import type { Instance } from "mobx-state-tree";
import React from "react";

const LazyLineChart = React.lazy(() => import("@/components/charts/LineChart.component.tsx"));

interface IProps {
	i: string;
	width: number;
	height: number;
}

class ChartTypeRenderer extends React.Component<IProps> {
	get item(): Instance<typeof GridItemModel> {
		return store.transfers.grid.all.get(this.props.i)!;
	}

	render() {
		switch (this.item.chartType) {
			case "line":
			case "bar":
				return (
					<LazyLineChart
						width={this.props.width}
						height={this.props.height}
						chartData={this.item.chartData}
						reactionString={store.isLoading + this.item.chartType + this.item.selectedY.join() + this.item.selectedX}
						formatY={this.item.formatY}
					/>
				);
			default:
				return `[no such chart ${this.item.chartType}]`;
		}
	}
}

export default observer(ChartTypeRenderer);
