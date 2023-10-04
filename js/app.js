let groutes = {
    asset: window.origin + "/storage/",
    imgDefault: "https://dummyimage.com/200x200/555/fff",
};

/**
 * crud class, depend on ajaxer
 *
 * todo: set ajaxer
 *
 */
class CRUD {
    routes = {
        create: "",
        read: "",
        update: "",
        delete: "",
        datatable: "",
    };

    form = null;
    formId = null;
    datatable = null;
    ajaxer = null;

    static lastid;

    constructor(form = null) {
        let id = "#form";
        this.form = form ? form : $(id)[0];
        this.formId = id;
    }

    setDatatable(dt) {
        this.datatable = dt;
        return this;
    }

    getDatatable() {
        return this.datatable;
    }

    reloadDatatable() {
        var dt = this.getDatatable();
        if (dt) {
            dt.ajax.reload();
        }
    }

    setCreateForm() {
        $(document).on("click", ".add", function () {
            $('.status').hide();
            $("#modal").modal("show");
            form.main.reset();
            $("#form").attr("data-id", "");
        });

        return this;
    }

    setCreate(id = null) {
        const ctx = this;
        ajaxer.post(
            this.routes.create,
            new FormData(this.form),
            function (response) {
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses',
                        text: response.message,
                    })
                    ctx.reloadDatatable();
                    $("#modal").modal("hide");
                } else {
                    throwErr(response)
                }
            },
            function(err) {
                throwErr(err);
            }
        );

        return this;
    }

	beforeUpdate(ctx, id){}
	afterUpdate(ctx, res){}

    setUpdate(id = null) {
        const ctx = this;
        var url = ctx.routes.update.replace("idx", id);

		ctx.beforeUpdate(ctx, id)
        // cl(url)
        ajaxer.post(
            ctx.routes.update.replace("idx", id),
            new FormData(this.form),
            function (response) {
				ctx.afterUpdate(ctx, response)
				
                if(response.success){
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses',
                        text: response.message,
                    })
                    // window.location.reload()
                    $("#modal").modal("hide");
                    ctx.reloadDatatable();
                }else{
                    throwErr(response);
                }
            },
            function(err){
                throwErr(err);
            }
        );

        return this;
    }

	beforeDelete(ctx, id){}
	afterDelete(ctx, res){}

    setDelete() {
        const ctx = this;
        $(document).on("click", "#btDelete", function (e) {
            e.preventDefault();
            var id = $(this).attr("data-id");
			ctx.beforeDelete(ctx, id)
			
            Swal.fire({
                icon: 'warning',
                title: 'Yakin?',
                text: 'Anda akan menghapus data ini?',
                showCancelButton:true
            })
            .then(({isConfirmed})=>{
                if(isConfirmed){
                    ajaxer.delete(
                        ctx.routes.delete.replace("idx", id),
                        null,
                        function (response) {
							ctx.afterDelete(ctx, response)
                            if(response.success){
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Sukses',
                                    text: response.message,
                                })
                                // window.location.reload()
                                ctx.reloadDatatable();
                            }else{
                                throwErr(response);
                            }
                        },
                        function(err){
                            throwErr(err);
                        }
                    );
                }
            })
        });

        return this;
    }

    setupForm(data) {
        $("#form").attr("data-id", data.id);
        // console.log(response)
        // console.log($('#form').attr("data-id"))
        form.main.set(data);
    }

    getSingle(id) {
        let ctx = this;
        ajaxer.get(routes.read.replace("idx", id), null, function (response) {
            ctx.setupForm(response.data);
        });
    }

    setEdit() {
        let ctx = this;
        $(document).on("click", "#btEdit", function (e) {
            e.preventDefault();
            var id = $(this).attr("data-id");
            /** Show Status Field when add */
            $('.status').show();
            CRUD.lastid = id;

            ctx.getSingle(id);
        });

        return this;
    }

    setSubmissionEvent() {
        const ctx = this;
        $(document).on("submit", "#form", function (e) {
            e.preventDefault();
            var data = new FormData(this);
            var id = $("#form").attr("data-id");

            if (id) {
                // alert("update")
                ctx.setUpdate(id);
            } else {
                // alert("create")
                ctx.setCreate(id);
            }
        });

        return this;
    }

    setFullEvent() {
        const ctx = this;

        this.setCreateForm().setSubmissionEvent().setDelete().setEdit();
    }
}

class ItemsView {
    items = [];
    target = "";
    itemFormat = "";
    mappedItems = [];
    mapper = null;
    maxItem = 16;

    constructor() {
        this.mapper = function (e, fmt) {
            return "item";
        };
		// todo set dynamic max item
		this.setMaxItem(100)
    }

    getMaxItem() {
        return this.maxItem;
    }

    setMaxItem(maxItem) {
        this.maxItem = maxItem;

        return this;
    }

    resetItems() {
        this.items = [];
        this.mappedItems = [];

        return this;
    }

    getMapper() {
        let mapper = this.mapper;
        if (typeof mapper != "function") {
            throw Error("mapper must be function");
        }

        return mapper;
    }

    setMapper(mapper) {
        if (typeof mapper != "function") {
            throw Error("mapper must be function");
        }

        this.mapper = mapper;

        return this;
    }

    setItems(items) {
        this.items = items;

        return this;
    }

    setItemsAndBuild(items) {
        this.items = items;
        this.build();

        return this;
    }

    /**
     * set joined item to specified selector e
     *
     * */
    async setItemsTo(e, items) {
        this.items = items;
        let builded = this.build();

        await $(e).html("");
        $(e).html(this.getJoinedMappedItems());

        return this;
    }

    getItems() {
        return this.items;
    }

    getJoinedMappedItems() {
        return this.mappedItems.join("");
    }

    build() {
        // this.items
        let ret = "";
        const ctx = this;

        this.items.forEach((e, i) => {
            if (i >= ctx.maxItem) {
                return;
            }

            let el = ctx.getMapper()(e, i);
            // ret += el
            ctx.mappedItems.push(el);
        });

        return ret;
    }
}

class ProductItemsView extends ItemsView {
    constructor() {
        super();
        this.mapper = function (e, i) {
            let id = e.db ? e.db.id || null : e.id || null;
            let img = wrapPic(e.image);

            // return ui.productView({
            return ui.productViewR1({
                name: e.name,
                img: img,
                price: util.currencyFloatFmt(e.price),
                // prop: `onclick="act('cart-add', {id: ${id}})"`,
                prop: `onclick="getAndShowMenuModal(${id})"`,
            });
        };
    }
}

class VouchersItemsView extends ItemsView {
	constructor() {
		super();
		this.mapper = function (e, i) {
			let id = e.db ? e.db.id || null : e.id || null;
			let img = wrapPic(e.image);
			let vo = e.db

			let isAbsolute = vo.type == "absolute"
			let val = isAbsolute ? `${vo.value}` : `${vo.value} %`
			let isExpired = false

			let b64v = btoa(JSON.stringify(e))

			// return ui.productView({
			return `<label class="pradio-voucher" for="vo${i}" style="width:100%">
				<input class="radio-voucher" type="radio" name="voucher" id="vo${i}" data-voucher="${b64v}">
				<div class="single-voucher">
					<i class="fa fa-voucher"></i>
					<div class="detail">
					<div class="title">${vo.name}</div>
					<p>${val} , EXP: ${vo.expired_at}</p>
					<div class="price text-primary">Hingga @${vo.max_disc}</div>
					</div>
				</div>
			</label>`;
		};
	}
}

class CartItemsView extends ItemsView {
    withImage = true;
    withCheckbox = false;

    setWithImage(wi) {
        this.withImage = wi ? true : false;

        return this;
    }

    setWithCheckbox(wc) {
        this.withCheckbox = wc ? true : false;

        return this;
    }

    constructor() {
        super();
        this.mapper = function (e, i) {
            let id = e.id ? e.id : null;
            let raw = e.raw ? e.raw : {};
            let data = {};

            if (raw) {
                data = raw.data;
            }
            let price = util.currencyFloatFmt(raw.price);
            let priceSub = util.currencyFloatFmt(e.subtotal);

            if (!data) {
                return "-";
            }

            let note = e.fullNote ? e.fullNote.max32() : "";
            note = e.fullNote
            note = note.max64()

            return `<div class="col-md-12 mb-1">
                <div class="single-menu">
                    <div class="d-flex justify-content-between">
                        <div class="w-100 d-flex flex-start">
                            <img src="https://dummyimage.com/200x200/555/fff" class="mr-3" alt="" style="width: 100px">
                            <div>
                                <span class="title">${data.name}</span>
                                <div class="qty">
                                    <span class="minus">-</span>
                                    <input class="form-control cartqty" type="number"
                                        value="${raw.qty}" min="0"
                                        data-id="${id}"
                                        data-mid="${data.id}"
                                        data-subid="${raw.subid}"
                                        >
                                    <span class="plus">+</span>
                                </div>
                                <span class="notes">Catatan : ${note}</span>
                                <button class="btn btn-outline-primary custom-menu" 
                                    data-idx="${i}" data-id="${raw.id}" >Custom</button>
                            </div>
                        </div>
                        <div class="text-right" style="width: 135px;">
                            <div class="total">${priceSub}</div>
                            <span>@${price}</span>
                        </div>
                    </div>
                </div>
            </div>`;
        };
    }
}

class SplitBillItemsView extends CartItemsView {
    withCheckbox = true;
    fnameCartQty = "cartqty";
    // fnameCartQty = "split-cartqty"

    setFnameCartQty(fcq) {
        this.fnameCartQty = fcq || "cartqty";

        return this;
    }

    constructor() {
        super();

        let ctx = this;
        this.mapper = function (e, i) {
            let id = e.id ? e.id : null;
            let raw = e.raw ? e.raw : {};
            let data = {};

            if (raw) {
                data = raw.data;
            }
            let price = util.currencyFloatFmt(raw.price);
            let priceSub = util.currencyFloatFmt(e.subtotal);

            if (!data) {
                return "-";
            }

            let checkbox = "";

            if (ctx.withCheckbox) {
                checkbox = `<input class="checkbox-menu" type="checkbox" name="mesplit" 
                    data-subid="${raw.subid}"
                    data-idx="${i}"
                    ></input>`;
            }

            let note = e.fullNote
            note = note.max64()

            return `<div class="col-md-12 mb-1 split-menu">
                ${checkbox}
                <div class="single-menu">
                    <div class="d-flex justify-content-between">
                        <div class="w-100 d-flex flex-start">
                            <div>
                                <span class="title">${data.name}</span>
                                <div class="qty">
                                    <span class="minus">-</span>
                                    <input class="form-control ${ctx.fnameCartQty}" type="number"
                                        value="${raw.qty}" min="0"
                                        data-id="${id}"
                                        data-mid="${data.id}"
                                        data-subid="${raw.subid}"
                                        >
                                    <span class="plus">+</span>
                                </div>
                                <span class="notes">Catatan : ${note}</span>
                            </div>
                        </div>
                        <div class="text-right" style="width: 135px;">
                            <div class="total">${priceSub}</div>
                            <span>@${price}</span>
                        </div>
                    </div>
                </div>
            </div>`;
        };
    }
}

/*
sample ProductItemsView

var vprodItem = new ProductItemsView()
let menus = [] // arr of menu
vprodItem.setItemsTo("#box-product", menus || [])

dtMenu.on('search', function (e, setting) {
    let data = dtMenu.rows( { filter : 'applied'} ).data();
    let arrdata = data ? data.toArray() : []
    gl.temp = arrdata
    vprodItem.resetItems().setItemsTo("#box-product", arrdata)
    
    // todos
});

dt.on('draw', function (e, setting, x) {
    let data = dt.rows( { filter : 'applied', page:'current'} ).data();
    let arrdata = data ? data.toArray() : []
    gl.temp = arrdata
    vCartItem.resetItems().setItemsTo("#box-product-cart", arrdata)
});
*/

// gui global ui helper
let ui = {
    br: "<br>",
    /*
    sample
    
    ui.button({
        slot: ""
    })
    */
    button: ({ slot = "", cclass = "", props = "" }) => {
        return `<button type="button" class="btn btn-primary ${cclass}" ${props}>
        ${slot}
        </button>`;
    },
    icons: {
        check: `<i class="fa fa-check"></i>`,
        menuBar: `<i class="fas fa-bars text-right"></i>`,
    },
    invItem: (id, name, val) => {
        return `<div class="invoice-detail-item">
                    <div class="invoice-detail-name">${name}</div>
                    <div class="invoice-detail-value" id="${id}">${val}</div>
                </div>`;
    },
    cardSmall: ({
        id,
        name = "",
        content = "",
        cl = "",
        header = "",
        attr = "",
        attrBody = "",
    }) => {
        if (!cl) {
            cl += "card-success";
        }
        let hh = `<div class="card-header">
            ${header}
        </div>`;
        // <h4>${name}</h4>

        if (!header) {
            // hh = "";
            content = `<h6>${name}</h6>` + content;
        }
        // style="background-color:#444455"
        return `<div class="col-12 col-md-6 col-lg-3" id="${id}" ${attr}>
            <div class="card ${cl}">
                ${hh}
                <div class="card-body" ${attrBody}>
                ${content}
                </div>
            </div>
          </div>`;
    },
    reservationCardTable: ({
        category = "Normal",
        img = null,
        timerProp = null,
        reservationName = null,
        reservationGroup = null,
        attrBody = "",
        status = "",
        withCapacity = false,
    }) => {
        img = img || window.location.origin + "/assets/img/roundtable.svg";

        // todo
        let capacity = `<p class="capacity mt-2">Kapasitas : <span>0/5</span></p>`;
        let unpaidNote =
            status == "unpaid"
                ? `<span class="text-danger">Belum Bayar</span>`
                : "";

        return `<div ${attrBody}>
        <span class="text-primary">${category}</span>
            <div class="roundtable-container">
                <img src="${img}" alt="">
                <div class="timer">
                    <h6 ${timerProp}>00:00</h6>
                </div>
            </div>
            <h6 class="customer">${reservationName}</h6>
            <h6 class="customer">${reservationGroup}</h6>
            ${unpaidNote}
            </div>
        `;
    },
    cardTable: ({
        id,
        name = "",
        isActive = false,
        content = "",
        cl = "",
        header = "",
        attr = "",
        attrBody = "",
        choosable = true,
        fieldname = "",
        inputprop = "",
    }) => {
        let active = isActive ? "active" : "";

        if (!cl) {
            cl += "card-success";
        }

        if (!header) {
            // hh = "";
            content = `<h6>${name}</h6>` + content;
        }

        let main = `<div class="roundtable ${active}">
            <div class="d-flex justify-content-between align-items-center">
            ${header}
            </div>
            ${content}
        </div>`;

        main = choosable
            ? `<label for="" style="width:100%">
            <input class="radio-meja" type="checkbox" name="${fieldname}" ${inputprop}>
            ${main}
        </label>`
            : main;

        // style="background-color:#444455"
        return `<div class="col-md-3" id="${id}" ${attr}>
            ${main}
        </div>`;
    },
    productView({
        name,
        price,
        rating = false,
        img = null,
        prop = null,
        imgAlt = null,
    }) {
        img = img
            ? img
            : "https://img.freepik.com/free-vector/hand-drawn-hot-pot-illustration_52683-53525.jpg";
        imgAlt = imgAlt ? imgAlt : "pic";
        star = `<i class="fas fa-star"></i>`;
        let stars = rating ? star : "";
        prop = prop ? prop : "";

        return `<div class="col-3 col-md-6 col-lg-3">
            <div class="product-item pb-3">
                <div class="product-image" style="background-image: url('${img}')">
                </div>
                <div class="product-details">
                    <div class="product-name">${name}</div>
                    <div class="product-review">
                        ${stars}
                    </div>
                    <div class="text-muted text-small">${price}</div>
                    <div class="product-cta">
                        <a href="#" class="btn btn-primary" ${prop}>Tambah</a>
                    </div>
                </div>  
            </div>
        </div>`;
    },
    productViewR1({
        name,
        price,
        rating = false,
        img = null,
        prop = null,
        imgAlt = null,
    }) {
        img = img
            ? img
            : "https://img.freepik.com/free-vector/hand-drawn-hot-pot-illustration_52683-53525.jpg";
        imgAlt = imgAlt ? imgAlt : "pic";
        star = `<i class="fas fa-star"></i>`;
        let stars = rating ? star : "";
        prop = prop ? prop : "";

        return `<div class="col-4 col-md-6 col-lg-4 p-0">
            <div class="product-item p-2">
            <div class="product-image" style="background-image: url('${img}')">
            </div>
                <div class="product-details">
                    <div class="title">${name}</div>
                    <div class="price">${price}</div>
                    <div class="product-cta">
                    <a href="#" class="btn btn-primary" ${prop}>Tambah</a>
                    </div>
                </div>
            </div>
        </div>`;
    },
    checkBoxPill: ({
        name = "name",
        value = "val",
        label = "label",
        props = "",
        cclass = "",
        isTakeaway = false,
    }) => {
        let takeaway = isTakeaway ? "cust-takeaway" : ""

        return `<label class="selectgroup-item ${takeaway}">
            <input type="checkbox" name="${name}" value="${value}" class="selectgroup-input" ${props}>
            <span class="selectgroup-button ${cclass} ${takeaway}">${label}</span>
        </label>`;
    },
    p: (cn = "") => {
        return `<p>${cn}</p>`;
    },
};

// global util helper, test
let util = {
    deepCopyObj(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    copyInstance(obj) {
        return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
    },
    makeClock(fn = null) {
        let dt = new Date();
        fn = fn || function (dt) {};

        return {
            dt: dt,
            intervalIns: setInterval(() => {
                dt = new Date();
                fn(dt);
            }, 1000),
        };
    },
	// util.setLoading
	setLoading(c=false){
		// cl("load "+c)
		if(c){
			$("#liLoading").attr("loading", "true").show()
		}else{
			$("#liLoading").attr("loading", "false").hide()
		}
	},
    // ty https://www.w3schools com/howto/howto_js_countdown.asp
    // create countdown
    createTimeCounter({
        fromDatetime,
        toDatetime,
        useAbs = false,
        callback = null,
    }) {
        // Set the date we're counting down to
        var countDownDate = new Date(toDatetime).getTime();

        if (callback == null) {
            callback = function (datetimeLeft) {};
        }
        // Update the count down every 1 second
        // var now = new Date(fromDatetime).getTime();
        var counter = 0;
        var x = setInterval(function () {
            // Get today's date and time
            var now = null;

            if (counter == 0) {
                now = new Date(fromDatetime).getTime();
            } else {
                var temp = new Date(fromDatetime).getTime();
                now = new Date(counter * 1000).getTime();
                now += temp;
            }

            // Find the distance between now and the count down date
            var distance = countDownDate - now;
            distance = useAbs ? Math.abs(distance) : distance;
            var sixtyk = 1000 * 60;

            // Time calculations for days, hours, minutes and seconds
            var datetimeLeft = {
                raw: distance,
                days: Math.floor(distance / (sixtyk * 60 * 24)),
                hours: Math.floor(
                    (distance % (sixtyk * 60 * 24)) / (sixtyk * 60)
                ),
                minutes: Math.floor((distance % (sixtyk * 60)) / sixtyk),
                seconds: Math.floor((distance % sixtyk) / 1000),
                isExpired: false,
            };

            callback(datetimeLeft);
            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(x);

                datetimeLeft.isExpired = true;
                callback(datetimeLeft);
                // document.getElementById("demo").innerHTML = "EXPIRED";
            }
            counter++;
        }, 1000);

        return x;
    },
    createCtdown(fromDatetime, toDatetime, callback = null) {
        return util.createTimeCounter({
            fromDatetime: fromDatetime,
            toDatetime: toDatetime,
            useAbs: false,
            callback,
        });
    },
    // cleave thousand
    createCleave(el = ".fcurrency") {
        return new Cleave(el, {
            numeral: true,
            numeralThousandsGroupStyle: "thousand",
        });
    },
    DatetimeLeftParser(DatetimeLeftObj) {
        return {
            formatted(n = 1) {
                var dtlo = DatetimeLeftObj;
                var ret = "";
                if (!dtlo.isExpired) {
                    switch (n) {
                        case "s":
                            let pads = (e) => e.toString().padStart(2, "0");

                            ret = `${pads(dtlo.hours)}:${pads(
                                dtlo.minutes
                            )}:${pads(dtlo.seconds)}`;
                            break;
                        case "md":
                            ret =
                                dtlo.minutes +
                                " menit " +
                                dtlo.seconds +
                                " detik";
                            break;
                        default:
                            ret =
                                dtlo.days +
                                " Hari " +
                                dtlo.hours +
                                " jam " +
                                dtlo.minutes +
                                " menit " +
                                dtlo.seconds +
                                " detik";
                    }
                } else {
                    ret = "Expired";
                }
                return ret;
            },
        };
    },
    moDBDate(dt) {
        // get date like 2022-02-21 09:42:41
        // cl(dt);
        // wrong
        // return moment(dt).format("Y-MM-DD HH:MM:SS");
        return moment(dt).format("Y-MM-DD HH:mm:ss");
    },
    getNow() {
        return util.moDBDate(new Date());
    },
    toDatetimeLocale(dt) {
        if (!(dt instanceof Date)) {
            dt = new Date(dt);
        }
        return dt.toLocaleDateString() + " " + dt.toLocaleTimeString();
    },
    dmyhm(date) {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getFullYear();
        var hm = date.getHours() + ":" + date.getMinutes();

        return day + "/" + month + "/" + year + " " + hm;
    },
    absInt(num) {
        return Math.abs(parseInt(num));
    },
    floatId(num) {
        return parseFloat(num).toLocaleString("id-ID");
    },
	// util.currencyFloatFmt()
    currencyFloatFmt(num, fmt = "id-ID") {
        // return util.currencyFmt(util.floatId(num, fmt), fmt);
		let s = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num)
		// note that this is a +U00a0 char
		return s.replace(" ", "")
    },
    currencyFmt(num, fmt = "id") {
		// console.log()
		// ,00
		let hasDec = num % 1 != 0

        switch (fmt) {
            case "id":
            case "id-ID":
            default:
				if(hasDec){
					return `Rp${num},00`;
				}else{
					return `Rp${num},${num % 1}`;
				}
                break;
        }
        // Rp1.000,00
        /*
        util.arrToSelect2([{id:1, name:"abc"},{ id:3, name:"xab"}], (e,i)=>{
            return {id: e.id, text: e.name}
        })
         */
    },
    arrToSelect2(arr = [], func = null) {
        func =
            func ||
            function (e, i) {
                return e;
            };

        let ret = [];

        arr.forEach((e, i) => {
            ret.push(func(e, i));
        });

        return ret;
    },
};

function GetFormattedDate() {
    var todayTime = new Date();
    return month + "/" + day + "/" + year;
}

/*

preview upload after select file

example:

setUploadPreview(
    document.querySelector("input[name=logo]"), 
    document.querySelector("#imlogo"),
    true,
    function(){
        var el = document.querySelector("input[name=logo_url]")
        el.value = ""
    }
)
*/
function setUploadPreview(field, img, imgel = true, callback = null) {
    const image_input = field;
    image_input.addEventListener("change", function () {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const uploaded_image = reader.result;
            if (imgel) {
                img.src = uploaded_image;
            } else {
                img.style.backgroundImage = `url(${uploaded_image})`;
            }
            if (callback) {
                callback(reader);
            }
        });
        reader.readAsDataURL(this.files[0]);
    });

    return image_input;
}

function wrapPic(img) {
    if (!img) {
        return null;
    }

    let hasHttp = img.indexOf("http") === 0;

    if (hasHttp) {
        return img;
    }

    return img ? groutes.asset + img : null;
}
// global behaviour @checkbox

function evtCheckbox() {
    let fn = function (e) {
        let v = $(this).val();
        cl(v);
        if (v == "0") {
            $(this).val("1");
        } else {
            $(this).val("0");
        }
    };

    $("input[type=checkbox]").on("click", fn);
}

/*
sample

renderOpt({
    arr: [{
        id: 1,
        name: "name"
    },
    {
        id: 2,
        name: "name 2"
    }], mapping: {
        value: "id",
        label: "name",
}})

*/
function renderOpt({ arr, mapping = {}, initVal = "Pilih" }) {
    let usingArr = mapping === "arr";
    if (!mapping) {
        mapping = {
            value: "x",
            label: "x",
        };
    }

    let ret = `<option value="">${initVal}</option>`;
    let t = `<option value="[v]">[label]</option>`;
    arr.forEach((e) => {
        if (usingArr) {
            ret += t.replace("[v]", e).replace("[label]", e);
        } else {
            ret += t
                .replace("[v]", e[mapping.value])
                .replace("[label]", e[mapping.label]);
        }
    });
    return ret;
}

function generalCRUD(crud) {
    if (!crud) {
        crud = new CRUD();
    }
    crud.setFullEvent();

    return crud;
}

function initCRUD(crud = null) {
    if (!crud) {
        crud = new CRUD();
    }
    crud.routes = routes;
    crud.setDatatable(dt);
    let c = generalCRUD(crud);

    return c;
}

const cl = console.log;

// prototypes
String.prototype.noPunctuation = function () {
    let x = this.match(/\w/g);
    return x ? (x.length > 0 ? x.join("") : 0) : 0;
};

String.prototype.noPunctuationCustom = function () {
    let x = this.match(/\w|\./g);
    return x ? (x.length > 0 ? x.join("") : 0) : 0;
};

function strMaxN(str, n) {
    return (str = str ? (str.length > n ? str.substr(0, n) + "..." : str) : "");
}

String.prototype.max32 = function () {
    return strMaxN(this, 32);
};

String.prototype.max64 = function () {
    return strMaxN(this, 64);
};

Object.defineProperty(String.prototype, 'capitalize', {
	value: function() {
	  return this.charAt(0).toUpperCase() + this.slice(1);
	},
	enumerable: false
});

Number.prototype.separate = function(){
	return util.floatId(this)
}

Number.prototype.toIDR = function(){
	return util.currencyFloatFmt(this)
}

Array.prototype.unique = function() {
	let arr = this
	var hash = {}, result = [];
	for ( var i = 0, l = arr.length; i < l; ++i ) {
		if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
			hash[ arr[i] ] = true;
			result.push(arr[i]);
		}
	}
	return result;
}

/*
let arr = [{
	id: 1,
	name: "name"
},{
		id: 2,
		name: "name 2"
	}]
arr.toOpts({
	mapping: {
		value: "id",
		label: "name",
}})
*/
Array.prototype.toOpts = function({mapping={}, initVal = "Pilih"}){
	let usingArr = mapping === "arr";
	if (!mapping) {
		mapping = {
			value: "x",
			label: "x",
		};
	}

	if(!fn){
		fn = (e)=> `<option value=${e}>${e}</option>`
	}

	let ret = `<option value="">${initVal}</option>`;
	let t = `<option value="[v]">[label]</option>`;

	return ret + this.map(function(){
		if (usingArr) {
            return t.replace("[v]", e).replace("[label]", e);
        } else {
            return t
                .replace("[v]", e[mapping.value])
                .replace("[label]", e[mapping.label]);
        }
	}).join("")
}