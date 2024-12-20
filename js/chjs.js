// var KTChartsWidget36 = function () {
/*
@adibenc
chartjs wrapper
*/
class CHJS{
	elId = "kt_charts_widget_36"
	dom = null
	chart = null
	data = null
	config = {}

	constructor(elId){
		this.elId = elId
		this.dom = document.getElementById(this.elId)
	}

	setData(d){
		this.data = d

		return this
	}

	setConfig(c){
		this.config = c
		return this
	}

	// setConfFormat("dn")
	setConfFormat(t){
		switch(t){
			case "doughnut":
			case "dn":
				this.setConfig({
					type: 'doughnut',
					/* data: {
						datasets: [{
							data: [150, 50, 25],
							backgroundColor: ['#00A3FF', '#50CD89', '#E4E6EF']
						}],
						labels: ['Active', 'Completed', 'Yet to start']
					}, */
					data: this.data,
					options: {
						chart: {
							fontFamily: 'inherit'
						},
						borderWidth: 0,
						cutout: '75%',
						cutoutPercentage: 65,
						responsive: true,
						maintainAspectRatio: false,
						title: {
							display: false
						},
						animation: {
							animateScale: true,
							animateRotate: true
						},
						stroke: {
							width: 0
						},
						tooltips: {
							enabled: true,
							intersect: false,
							mode: 'nearest',
							bodySpacing: 5,
							yPadding: 10,
							xPadding: 10,
							caretPadding: 0,
							displayColors: false,
							backgroundColor: '#20D489',
							titleFontColor: '#ffffff',
							cornerRadius: 4,
							footerSpacing: 0,
							titleSpacing: 0
						},
						plugins: {
							legend: {
								display: false
							}
						}
					}
				})
			break;
		}

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
	initChart(reset=true) {
		// let chart = this.chart
		var element = this.dom

		// cl(element)

		if (!element) {
			return;
		}

		// flag
		var config = this.config;
		// must be document.getElementById compat
		var ctx = element.getContext('2d');

		if(this.chart){
			this.chart.destroy()
		}
		
		this.chart = new Chart(ctx, config);

		setTimeout(function() {
			
		}, 200);
	}

    // Public methods
    init() {
		let ctx = this
		this.initChart(
			this.chart
		);

		// Update chart on theme mode change
		/*
		KTThemeMode.on("kt.thememode.change", function() {                
			if (ctx.chart.rendered) {
				ctx.chart.self.destroy();
			}

			ctx.initChart(chart);
		});
		*/

		return this
	}
}

/*
example:

ch.chName.setConfFormat(t)
.init()
*/