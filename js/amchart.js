"use strict";

// var KTChartsWidget36 = function () {
/*
@adibenc
amchart js wrapper

<script src="https://cdn.amcharts.com/lib/5/index.js"></script>
<script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
<script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
*/
class AMchartJS{
	elId = "elementId"
	dom = null

	// am chart core configs
	chart = null
	data = null
	root = null
	callbacks = []

	// callback confs
	cbConfs = []

	fnHbar = null

	// chKUK
	constructor(elId){
		this.elId = elId
		this.dom = document.getElementById(this.elId)

		this.fnHbar = () => {}
		
		// this.setRoot()
		// this.init()
	}

	setData(d){
		this.data = d

		return this
	}

	setConfig(c){
		this.config = c
		return this
	}

	addCbConfs(fn){
		this.cbConfs.push(fn)
		return this
	}

	// setConfFormat("hbar")
	setConfFormat(t){
		let root = this.root
		let chart = this.chart
		let ctx = this

		switch(t){
			case "hbar":
				cl("hb root")
				cl(root)
				var data = this.data
				
				var yRenderer = am5xy.AxisRendererY.new(root, {});
				var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
					categoryField: "y",
					renderer: yRenderer,
					tooltip: am5.Tooltip.new(root, {})
				}));

				yRenderer.grid.template.setAll({
					location: 1
				})

				yAxis.data.setAll(data);

				var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
					min: 0,
					maxPrecision: 0,
					renderer: am5xy.AxisRendererX.new(root, {
						minGridDistance: 40,
						strokeOpacity: 0.1
					})
				}));

				// Add legend
				// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
				var legend = chart.children.push(am5.Legend.new(root, {
					centerX: am5.p50,
					x: am5.p50
				}));

				this.fnHbar = (function (name, fieldName) {
					var series = chart.series.push(am5xy.ColumnSeries.new(root, {
						name: name,
						stacked: true,
						xAxis: xAxis,
						yAxis: yAxis,
						baseAxis: yAxis,
						valueXField: fieldName,
						categoryYField: "y"
					}));
			
					series.columns.template.setAll({
						tooltipText: "{name}, {categoryY}: {valueX}",
						tooltipY: am5.percent(90)
					});
					series.data.setAll(data);
			
					// Make stuff animate on load
					// https://www.amcharts.com/docs/v5/concepts/animations/
					series.appear();
			
					series.bullets.push(function() {
						return am5.Bullet.new(root, {
							sprite: am5.Label.new(root, {
								text: "{valueX}",
								fill: root.interfaceColors.get("alternativeText"),
								centerY: am5.p50,
								centerX: am5.p50,
								populateText: true
							})
						});
					});
			
					legend.data.push(series);
				})

				this.cbConfs.forEach((fn)=>{
					return fn(ctx)
				})

			break;
		}

		ctx = this

		return this
	}
	
	appendOptions(opt){
		this.options = {
			...this.options,
			...opt,
		}

		return this
	}

	// Private methods
	setRoot() {
		if(this.root){
			return this
		}

		var root = am5.Root.new(this.elId);
		var myTheme = am5.Theme.new(root);
		myTheme.rule("Grid", ["base"]).setAll({
			strokeOpacity: 0.1
		});

		// Set themes
		// https://www.amcharts.com/docs/v5/concepts/themes/
		root.setThemes([
			am5themes_Animated.new(root),
			myTheme
		]);
		this.root = root

		return this
	}

	_initChart(reset=true) {
		// this.chart = new Chart(ctx, config);
		let chart = this.root.container.children.push(am5xy.XYChart.new(
			this.root, {
			panX: false,
			panY: false,
			paddingLeft: 0,
			layout: this.root.verticalLayout
		}));
		this.chart = chart

		setTimeout(function() {
			
		}, 200);
	}

	setThemes() {
	}

    // Public methods
    init(reset=true) {
		this.setRoot()
		this._initChart(reset)

		return this
	}

	appear(x=1000,y=100){
		this.chart.appear(1000, 100);
	}

	/*
	wip
	root.dispose();
	*/
}

/*
example:

ch.chName.setConfFormat(t)
.init()
*/