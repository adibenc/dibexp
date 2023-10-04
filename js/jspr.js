// jspread v4 helper
/*
@adibenc

// assuming data is datatable.data() return-compatible
let jdata = JSPR.dtToJsprArray(data, fnJsprMapper)
let jdArr = jdata.toArray()

// let jspr = fnInitJSPR(jdata)

## default init
jspr = (new JSPR("jspr1", {
	data: jdata,
	columns: [
		{ type: 'text', title: 'Site', readOnly:true,},
		{ type: 'hidden', title: "hqty" },
		{ type: 'hidden', title: "hqtyso" },
		{ type: 'text', mask:'Rp#.##,00', title: "Fee jalan", name: "road_fee" },
		{ type: 'text', mask:'Rp#.##,00', title: "Hauling", name: "hauling" },
		{ type: 'text', mask:'Rp#.##,00', title: "Sewa Jetty", name: "jetty_rent" },
		{ type: 'text', mask:'Rp#.##,00', title: "Crusher", name: "crusher" },
		{ type: 'text', mask:'Rp#.##,00', title: "PNBP", name: "pnbp" },
		{ type: 'text', mask:'Rp#.##,00', title: "PPH 1,5%", name: "pph1_5" },
		{ type: 'html', title: "#" },
	],
}))

if(!jspr){
	throw("fnInitJSPR must return JSPR obj!")
}
jspr.create()

// jspr.autoWidth()
jspr.setFixedColSizes({
	0: 200
}).autoResizeAll()

## alternateinitialization

slightly same as above, only shorter.
```
jspr = (new JSPR("jspr1", {
	data: jdata,
	columns: [
		{ type: 'text', title: 'Site', readOnly:true,},
		{ type: 'hidden', title: "hqty" },
		{ type: 'hidden', title: "hqtyso" },
		{ type: 'text', mask:'Rp#.##,00', title: "Fee jalan", name: "road_fee" },
		{ type: 'text', mask:'Rp#.##,00', title: "Hauling", name: "hauling" },
		{ type: 'text', mask:'Rp#.##,00', title: "Sewa Jetty", name: "jetty_rent" },
		{ type: 'text', mask:'Rp#.##,00', title: "Crusher", name: "crusher" },
		{ type: 'text', mask:'Rp#.##,00', title: "PNBP", name: "pnbp" },
		{ type: 'text', mask:'Rp#.##,00', title: "PPH 1,5%", name: "pph1_5" },
		{ type: 'html', title: "#" },
	],
}))
jspr.decorate(null, jspr)
```

## datatable initialization

## get data
// get data overview:
obj.instance.getData()

Jspreadsheet manager util
*/
class JSPR{
	conf = {}
	instance = null
	totalWidthSizeRatio = 0.8
	colSize = 1
	fixedColSizes = {}
	execClearEl = true
	
	autoSave = false
	autoSaveTimeout = 3000 // in ms
	fnAutoSave = null
	oTimeout = null

	constructor(id, conf){
		this.id = id
		this.conf = conf
		this.setDefaultAutoSaveFn()
	}

	setAutoSaveFn(fn){
		if(!(typeof fn == 'function')){
			throw Error("Illegal arg of fn: fn is not a function")
		}

		this.fnAutoSave = fn

		return this
	}
	
	setDefaultAutoSaveFn(){
		this.fnAutoSave = (jspr) => { }

		return this
	}
	
	execAutoSave(){
		let ctx = this
		if(this.autoSaveTimeout > 0){
			// cancel previous timeout instance if exist, so there is no double execution
			clearTimeout(this.oTimeout)

			this.oTimeout = setTimeout(function(){
				ctx.fnAutoSave(ctx)
			}, this.autoSaveTimeout)
		}
	}

	setTotalWidthSizeRatio(tws){
		this.totalWidthSizeRatio = parseFloat(tws)

		return this
	}

	setFixedColSizes(fcs){
		this.fixedColSizes = fcs

		return this
	}

	setupStyle(){
		$("table.jexcel").addClass("table table-row-dashed align-middle gs-0 gy-3 my-0")
	}

	// static method doesn't require class instantiation
	static dtToJsprArray(data, fn){
		let conv = data.map(fn)
		return conv
	}

	decorate(t, obj){
		switch(t){
			default:
				obj.create()

				// jspr1.autoWidth()
				obj.setFixedColSizes({
					0: 200
				}).autoResizeAll()
		}
	}

	/*
	there are many reason to not intialize some option at jspr manager initialization.
	Some customizations are simply cannot be done at jspr initialization..
	*/
	overrideOptions(e){
		if(!(e instanceof Object)){
			throw("Argument is not an object!")
		}

		let prevOps = this.instance.options
		this.instance.options = {
			...prevOps,
			...e,
		}
		return this
	}

	// working ratio : window.innerWidth * 0.65 / 10
	autoResizeAll(){
		// set dynamic width by screen width
		let ins = this.instance
		let totalWidthSizeRatio = this.totalWidthSizeRatio

		let distWidths = 100
		if(this.colSize != 0 && !isNaN(this.colSize)){
			distWidths = window.innerWidth * totalWidthSizeRatio / this.colSize
		}

		for(let i of range(0,100)){
			let ifcs = this.fixedColSizes[i]
			if(ifcs){
				ins.setWidth(i, ifcs)
				continue
			}
			
			try{
				ins.setWidth(i, distWidths)
				// try{
			}catch(e){
				// cl([i,e])
				break
			}
		}
		
		return this
	}

	create(){
		let ctx = this
		if(this.execClearEl){
			$(`#${this.id}`).html("")
		}

		let conf = this.conf

		if(conf.columns){
			this.colSize = conf.columns.length
		}

		if(this.autoSaveTimeout > 0){
			conf.onchange = function(){
				ctx.execAutoSave()
			}
		}

		let inst = jspreadsheet(document.getElementById(this.id), {
			data:[],
			columns: [
				{ type: 'text', title: 'c1', readOnly:true,},
				{ type: 'text', title: 'c2', },
				{ type: 'text', title: 'c3', },
				{ type: 'text', title: 'c4', },
			],
			// allowInsertRow: false,
			// allowInsertColumn: false,
			allowManualInsertRow: false,
			allowManualInsertColumn: false,
			allowDeleteRow: false,

			columnSorting: false,
			columnDrag: false,
			columnResize: false,
			...conf
		});

		this.instance = inst

		return inst
	}
}

/* 

jspr x datatable: on draw func generator for datatable
@return function 
*/
function createJsprDtOnDraw({
	dt,
	fnJsprMapper = null,
	fnInitJSPR = null,
	fnFormulas = null,
	fnPostDraw = null, // must return jspr
}){
	return async function (e, setting) {
		let data = dt.rows({ filter: "applied", page: "current" }).data();
		let arrdata = data ? data.toArray() : [];

		cl(arrdata)
		
		let jdata = JSPR.dtToJsprArray(data, fnJsprMapper)
		let jdArr = jdata.toArray()

		// https://jspreadsheet.com/docs/columns
		let jspr = fnInitJSPR(jdata)

		if(!jspr){
			throw("fnInitJSPR must return JSPR obj!")
		}
		jspr.create()

		// jspr.autoWidth()
		// jspr.setFixedColSizes({
		// 	0: 200
		// }).autoResizeAll()

		// todo dynamic jspr event func
		fnPostDraw(jspr)
		// await jsprs.push(jspr)

		dt.jspr = jspr
	}
}

/* 

example:

let dt1 = $("#el").DataTable()

let fnOnDraw = createJsprDtOnDraw({
	dt: dt1,
	fnJsprMapper: (e, i)=>{
		// dbsiteorder
		let dbso = e.dbso
		let order = e.order
		let simd = dbso.simulation_detail ? dbso.simulation_detail[0] : null
		let site = dbso.site ? dbso.site : null

		return [
			`${site.iup_no} \n ${site.kabkota}`,
			parseFloat(order.qty),
			parseFloat(dbso.qty_so),
			simd.road_fee,
			simd.hauling,
			simd.jetty_rent,
			simd.crusher,
			simd.pnbp,
			simd.pph1_5,
			// "#btn-save"
			`<button type="button" data-type="h2j" data-id_simd="${simd.id_simd}" data-idx="${i}" class="btn btn-sm btn-primary save">Save</button>`,
		]
	},
	fnInitJSPR: (jdata)=>{
		return (new JSPR("jspr1", {
			data: jdata,
			columns: [
				{ type: 'text', title: 'Site', readOnly:true,},
				{ type: 'hidden', title: "hqty" },
				{ type: 'hidden', title: "hqtyso" },
				{ type: 'text', mask:'Rp#.##,00', title: "Fee jalan", name: "road_fee" },
				{ type: 'text', mask:'Rp#.##,00', title: "Hauling", name: "hauling" },
				{ type: 'text', mask:'Rp#.##,00', title: "Sewa Jetty", name: "jetty_rent" },
				{ type: 'text', mask:'Rp#.##,00', title: "Crusher", name: "crusher" },
				{ type: 'text', mask:'Rp#.##,00', title: "PNBP", name: "pnbp" },
				{ type: 'text', mask:'Rp#.##,00', title: "PPH 1,5%", name: "pph1_5" },
				{ type: 'html', title: "#" },
			],
		}))
	},
	fnFormulas: function(jdArr){
		return [
			1, 2, 
			ratioFormula("D", jdArr),
			ratioFormula("E", jdArr),
			ratioFormula("F", jdArr),
			ratioFormula("G", jdArr),
			ratioFormula("H", jdArr),
			ratioFormula("I", jdArr),
			// 4, 5, 6, 7, 8
		]
	},
	fnPostDraw: function(jspr){
		jspr.type = "h2j"
		return jspr
	}
})); 

dtDetail.on("draw", fnOnDraw)

// */