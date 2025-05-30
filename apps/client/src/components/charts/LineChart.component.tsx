"use client";
import echarts from "@/lib/echarts";
import React from "react";

interface IProps {
	width: number;
	height: number;
	chartData: ILineChartData;
	reactionString: string;
	formatY?: (value: number, seriesIndex: number) => number | string;
}

export default class LineChart extends React.Component<IProps> {
	static defaultProps: Partial<IProps> = {
		formatY: value => value,
	};

	$chart = React.createRef<HTMLDivElement>();
	chartInstance: echarts.EChartsType | null = null;

	componentDidMount() {
		if (this.$chart.current) {
			this.chartInstance = echarts.init(this.$chart.current);
			this.update();
			window.addEventListener("resize", this.onResize);
		}
	}

	componentDidUpdate(prevProps: IProps) {
		if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
			if (this.chartInstance) this.chartInstance.resize(); // resize to new dimensions
		}
		if (prevProps.reactionString !== this.props.reactionString) this.update();
	}

	componentWillUnmount() {
		this.chartInstance?.dispose();
		window.removeEventListener("resize", this.onResize);
	}

	onResize = () => {
		this.chartInstance?.resize();
	};

	update = () => {
		if (!this.chartInstance) return;

		// const longestLabel = Math.max(...this.props.chartData.series.map(item => item.name.length));
		// const gridRight = 20 + longestLabel * 6.5; // estimate 8px per character

		this.chartInstance.clear();
		this.chartInstance.setOption({
			animation: false,
			tooltip: {
				trigger: "axis",
				formatter: (params: any) => {
					const sorted = params.toSorted((a: any, b: any) => b.data - a.data);

					let tooltipText = `${sorted[0].axisValueLabel}<br/>`;
					sorted.forEach((item: any) => {
						tooltipText += `
							<div style="font-size: 12px; display: flex; justify-content: space-between">
								<div style="margin-right: 20px">
									${item.marker}
									${item.seriesName}
								</div>
								<b>${this.props.formatY!(item.data, item.seriesIndex)}</b>
							</div>
      					`;
					});
					return tooltipText;
				},
			},
			grid: {
				left: 0,
				right: 0, //gridRight,
				bottom: 0,
				top: 0,
				containLabel: true,
			},
			xAxis: {
				type: "category",
				data: this.props.chartData.xAxisData,
				nameLocation: "middle",
				splitLine: {
					show: true,
					lineStyle: {
						type: "dashed",
						opacity: 0.3,
					},
				},
			},
			yAxis: {
				type: "value",
				nameLocation: "middle",
				nameGap: 50,
				nameRotate: 90,
				min: this.props.chartData.minY,
				max: this.props.chartData.maxY,
				splitLine: {
					show: true,
					lineStyle: {
						type: "dashed",
						opacity: 0.3,
					},
				},
			},
			series: this.props.chartData.series,
			// toolbox: {
			// 	feature: {
			// 		magicType: { type: ["line", "bar"] },
			// 	},
			// 	right: 20,
			// 	top: 20,
			// },
		});
	};

	render() {
		return <div ref={this.$chart} style={{ width: this.props.width, height: this.props.height }} />;
	}
}
