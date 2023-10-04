var dtButton = function (tx, cn, ex) {
	return { text: tx, className: cn, extend: ex };
};

/*
buttons: [
	dtButton('COPY','btn btn-success lefty','copy'),
	dtButton('EXCEL','btn btn-success lefty','excel'),
	dtButton('CSV','btn btn-success lefty','csv'),
	dtButton('PDF','btn btn-success lefty','pdf'),
	dtButton('PRINT','btn btn-success lefty','print')
],
*/

var datatablesAjaxConf = function (url, columns, exp = true) {
	var ret = {
		// oLanguage: {
		//     "sSearch": "Pencarian",
		//     "lengthMenu": "Tampil _MENU_ baris / hal",
		//     "zeroRecords": "Data kosong",
		// },
		// "bLengthChange":true,
		bStateSave: true,
		// language:{},
		processing: true,
		serverSide: true,
		ajax: url,
		columns: columns,
	};

	if (exp) {
		// ret.dom = 'lBfrtip';
	}
	return ret;
};

var AppDatatable = {
	util: {
		colNumbering: function (dataname, colname) {
			return {
				data: dataname,
				render: function (data, type, row, meta) {
					return meta.row + meta.settings._iDisplayStart + 1;
				},
				name: colname,
			};
		},
	},
	cols: {
		basicFormat(data, name) {
			return { data: data, name: name };
		},
		basicRender(name, render) {
			return { data: name, name: name, render: render };
		},
	},
};

function dtFactory(el, url, columns) {
	var dt = $(el);

	if ($.fn.dataTable.isDataTable(el)) {
		dt.DataTable().destroy();
	}

	conf = datatablesAjaxConf(url, columns, false);
	let langConf = {
		search: "Cari _INPUT_",
		info: "Tampil _START_ s/d _END_ dari _TOTAL_ data",
		infoFiltered: "- difilter dari _MAX_ hasil",
		searchPlaceholder: "Cari...",
		lengthMenu: "Baris _MENU_",
		paginate: {
			first: "Awal",
			last: "Akhir",
			next: "&rarr;",
			previous: "&larr;",
		},
	};
	conf.language = langConf;

	return dt.DataTable(conf);
}

function dtCRUDFactory(el, url, columns, buttons = [], withnav=true) {
	if(withnav){
		columns.push({
			data: function (data) {
				var id = data.id;
				var btns = [
					`<button id="btEdit" class="btn btn-sm btn-success btn-edit" data-toggle="modal" data-target="#modal" data-id="${id}"> Edit </button>`,
					`<button id="btDelete" class="btn btn-sm btn-danger btn-edit" data-id="${id}"> Delete</button>`,
				];
	
				// if buttons is not empty, then add it to btns
				if (buttons.length > 0) {
					let btnsWithId = buttons.map(function (btn) {
						return btn.replace("{id}", id);
					});
					btns = btns.concat(btnsWithId);
				}
	
				btns = btns.join(" ");
				return btns;
			},
			name: "btn",
			orderable: false,
			searchable: false,
		});
	}

	return dtFactory(el, url, columns);
}

/*
example 4 custom:

let dtCrud = new DTCRUD()

// minimal
dtCrud.setWithAjax(false)
	.build("#dtid", null, [
		{ data: "no"},
		{ data: "name"},
		{ data: "harga"},
		{ data: "action"},
	]
)

// ajax
dtCrud.build("#dtid", "http://api", [
		{ data: "no"},
		{ data: "name"},
		{ data: "harga"},
		{ data: "action"},
	]
)

// custom
dtCrud.setWithAjax(false)
	.setActionBtns(function(data){
		return [
			`<button class="btn btn-sm btn-danger btn-del-optional" 
				data-mid="" data-m2id="" data-id="${data.id}"> 
				Delete</button>`
		]
	})
	.build("#dtid", null, [
		{ data: "no"},
		{ data: "name"},
		{ data: "harga"},
		{ data: "action"},
	]
)
*/
class DTCRUD {
	buttons = [];
	withAjax = true;
	defActionBtns = null;
	actionBtns = null;

	constructor() {
		this.buttons = [];
		let fn = function (data) {
			return [
				`<button id="btEdit" class="btn btn-sm btn-success btn-edit" data-toggle="modal" data-target="#modal" data-id="${data.id}"> Edit </button>`,
				`<button id="btDelete" class="btn btn-sm btn-danger btn-edit" data-id="${data.id}"> Delete</button>`,
			];
		};
		this.actionBtns = fn;
		this.defActionBtns = fn;
	}

	setActionBtns(actionBtns) {
		let legit = typeof actionBtns === "function";

		this.actionBtns = actionBtns && legit ? actionBtns : this.defActionBtns;

		return this;
	}

	setWithAjax(withAjax) {
		this.withAjax = withAjax ? true : false;

		return this;
	}

	dtConf(url, columns, exp = true) {
		var ret = {
			// oLanguage: {
			//     "sSearch": "Pencarian",
			//     "lengthMenu": "Tampil _MENU_ baris / hal",
			//     "zeroRecords": "Data kosong",
			// },
			// "bLengthChange":true,
			bStateSave: true,
			// language:{},
			columns: columns,
		};

		if (this.withAjax) {
			ret = {
				...ret,
				processing: true,
				serverSide: true,
				ajax: url,
			};
		}

		if (exp) {
			// ret.dom = 'lBfrtip';
		}
		return ret;
	}

	getCustomConfigs() {
		return {};
	}

	dtFactory(el, url, columns) {
		var dt = $(el);

		if ($.fn.dataTable.isDataTable(el)) {
			dt.DataTable().destroy();
		}

		let conf = this.dtConf(url, columns, false);
		let langConf = {
			search: "Cari _INPUT_",
			info: "Tampil _START_ s/d _END_ dari _TOTAL_ data",
			infoFiltered: "- difilter dari _MAX_ hasil",
			searchPlaceholder: "Cari...",
			lengthMenu: "Baris _MENU_",
			paginate: {
				first: "Awal",
				last: "Akhir",
				next: "&rarr;",
				previous: "&larr;",
			},
		};
		let customConfigs = this.getCustomConfigs();
		conf.language = langConf;
		conf = { ...conf, customConfigs };

		return dt.DataTable(conf);
	}

	/**
	 *
	 * @return @array
	 *
	 *  */
	getNav(t, data = {}) {
		let ret = [];
		switch (t) {
			case "custom":
				break;
			default:
				ret = this.actionBtns(data);
		}

		return ret;
	}

	getDefaultNav(d) {
		return this.getNav(null, d);
	}

	build(el, url, columns) {
		const ctx = this;
		columns.push({
			data: function (data) {
				var id = data.id;
				var btns = ctx.getDefaultNav(data);
				btns = btns.join(" ");
				return btns;
			},
			name: "btn",
			orderable: false,
			searchable: false,
		});

		return this.dtFactory(el, url, columns);
	}
}

/*
example usage:

class DTCRUDExt extends DTCRUD{
	getCustomConfigs(){
		return {
			"columnDefs": [
				{ "width": "12%", "targets": 3 }
			]
		}
	}

	getDefaultNav(d){
		let baseBtn = this.getNav(null, d)
		baseBtn.push('<button class="btn btn-sm btn-info btn-menu-resep" data-id="{id}">Detail Resep</button>')
		return baseBtn
	}
}

const dtCrudExt = new DTCRUDExt()
const dtBase = new DTCRUD()

// var dt = dtCRUDFactory("#datatable", routes.datatable, [
var dt = dtCrudExt.build("#datatable", routes.datatable, [
	AppDatatable.util.colNumbering("id", "id"),
	AppDatatable.cols.basicFormat("name", "name"),
	// AppDatatable.cols.basicFormat("descr", "descr"),
	{
		data: "value",
		name: "value",
		render: (x, y, row)=>{
			let val = util.currencyFloatFmt(row.value)
			
			if(row.type == "absolute"){
				return val
			}else{
				return row.value + "% - " + util.currencyFloatFmt(row.max_usage)
			}
		}
	},{
		data: "max_usage",
		name: "max_usage",
		render: (x, y, row)=>{
			return row.usage + "/" + row.max_usage
		}
	},
])
*/
