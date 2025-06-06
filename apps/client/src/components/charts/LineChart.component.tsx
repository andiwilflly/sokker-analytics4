"use client";
import echarts from "@/lib/echarts.ts";
import React from "react";

interface IProps {
	width: number;
	height: number;
	chartData: ILineChartData;
	isChartsConnect: boolean;
	formatY?: (value: number, seriesIndex: number) => number | string;
}

export default class LineChart extends React.Component<IProps> {
	static defaultProps: Partial<IProps> = {
		formatY: value => value,
	};

	$chart = React.createRef<HTMLDivElement>();
	chartInstance: any = null;

	componentDidMount() {
		if (this.$chart.current) {
			this.chartInstance = echarts.init(this.$chart.current);

			if (this.props.isChartsConnect) {
				// Sync cursor lines
				this.chartInstance.group = this.props.chartData.xAxisData.join("");
				echarts.connect(this.props.chartData.xAxisData.join(""));
			}

			this.update();
			window.addEventListener("resize", this.onResize);
		}
	}

	componentDidUpdate(prevProps: IProps) {
		if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
			if (this.chartInstance) this.chartInstance.resize(); // resize to new dimensions
		}
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
				appendToBody: true,
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
				top: 5,
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
		});
	};

	render() {
		return <div ref={this.$chart} style={{ width: this.props.width, height: this.props.height }} />;
	}
}
