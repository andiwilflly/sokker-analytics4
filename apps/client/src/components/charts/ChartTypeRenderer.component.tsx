import type GridItemModel from "@/models/transfers/grid/GridItem.model";
import store from "@/store";
import type { TPIEChartData } from "@server/schema/charts.schema";
import { observer } from "mobx-react";
import type { Instance } from "mobx-state-tree";
import React from "react";

const LazyLineChart = React.lazy(() => import("@/components/charts/LineChart.component"));
const PIEChartLazy = React.lazy(() => import("@/components/charts/PIEChart.component"));

interface IProps {
	i: string;
	width: number;
	height: number;
	isChartsConnect: boolean;
}

class ChartTypeRenderer extends React.Component<IProps> {
	static defaultProps = {
		isChartsConnect: true,
	};

	get item(): Instance<typeof GridItemModel> {
		return store.transfers.grid.all.get(this.props.i)!;
	}

	render() {
		switch (this.item.chartType) {
			case "pie":
				return (
					<PIEChartLazy
						width={this.props.width}
						height={this.props.height}
						key={store.isLoading + this.item.chartType + this.item.selectedY.join() + this.item.selectedX}
						chartData={this.item.getChartData<TPIEChartData>()}
					/>
				);
			case "line":
			case "bar":
				return (
					<LazyLineChart
						width={this.props.width}
						isChartsConnect={this.props.isChartsConnect}
						height={this.props.height}
						chartData={this.item.getChartData<ILineChartData>()}
						key={store.isLoading + this.item.chartType + this.item.selectedY.join() + this.item.selectedX}
						formatY={this.item.formatY}
					/>
				);
			default:
				return `[no such chart ${this.item.chartType}]`;
		}
	}
}

export default observer(ChartTypeRenderer);
