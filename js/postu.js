/**
 * 
 * Postu
 * by @adib-enc
 * 
 */
class Entity{
	setDefaultCallback(){
		this.callbacks = {
			checkout: (e) =>{},
		}

		return this
	}

	setCallbacks(obj = null){
		if(!obj){

		}
		this.callbacks = obj

		return this
	}
}

/*
// todo : example 4 doc
https://gist.github.com/adib-enc/dddad8a4b2321ccdc94623ac0b79d194
*/
class Cart extends Entity{
	name = "cart"
	// to do : change to item
	items = []
	splitMenus = []

	callbacks = {}
	subtotal = 0
	total = 0
	currency = "Rp"
	lastServeMethod = "dine-in"
	shouldWithTax = true
	payLater = false
	withAggregatedPrice = true
	replaceAfterModify = false
	
	// itemGrouping = default | by-id | byid-subid
	itemGrouping = "default"

	// callback iterate
	cbIterate = (e) =>{
		e.iterate()
	}

	constructor(){
		super()
		this.setDefaultCallback()
	}

	// important to identify cart instance
	setName(name){
		this.name = name

		return this
	}

	getDefaultCallback(){
		let ctx = this
		return {
			getItem: (e) =>{},
			addItem: (e) =>{},
			addItemNote: ctx.cbIterate,
			addItemCustom: ctx.cbIterate,
			updateItemCustomById: ctx.cbIterate,
			appendOrUpdateItemCustom: ctx.cbIterate,
			appendItemCustom: (e) =>{},
			removeItemCustom: ctx.cbIterate,
			subItem: (e) =>{},
			removeItem: (e) =>{},
			getTotal: (e) =>{},
			clear: (e) =>{},
			checkout: (e) =>{},
			substractItemsByCart: (e) =>{},
			iterate: (e) =>{}
		}
	}

	setDefaultCallback(){
		let ctx = this
		
		this.callbacks = this.getDefaultCallback()

		return this
	}

	// is
	isValidId(id){
		return !(isNaN(id) && typeof id != 'string')
	}

	setWithAggregatedPrice(wap){
		this.withAggregatedPrice = wap ? true : false

		return this
	}
	
	setShouldWithTax(swt){
		this.shouldWithTax = swt ? true : false

		return this
	}
		
	resetSplitMenu(){
		this.splitMenus = []
		return this
	}

	pushSplitMenu(subid){
		if(this.splitMenus.indexOf(subid) < 0){
			this.splitMenus.push(subid)
		}
		
		return this
	}

	removeSplitMenu(subid){
		this.splitMenus = this.splitMenus.filter((e) => e.subid != subid)
		return this
	}
	
	setItemGrouping(itemGrouping){
		this.itemGrouping = itemGrouping

		return this
	}
	
	setLastServe(method){
		this.lastServeMethod = method

		return this
	}

	// condition for changing serve method
	// checkForServeMethod(method){
	isServeMethodDifferent(method){
		let menuItems = this.getItemByCat("menu")

		return this.lastServeMethod !== method && menuItems.length > 0
	}

	getUniqId(){
		return new Date().valueOf()
	}

	getItems(fn){
		return this.items.filter(fn)
	}

	getItem(id){
		let withIndex = true
		let fn = (e) => { return e.id == id}
		let res = this.getItems(fn)
		
		if(withIndex){
			this.lastGetIdx = this.getItemIndex(fn)
		}

		if(res.length > 0){
			res = res[0]
		}

		return res
	}

	getItemByItemGrouping(value){
		let igroup = this.itemGrouping
		let isDefault = igroup === "default" || igroup === "by-id"

		let fun = (e) => { return e.id == value}
		
		if(igroup === "byid-subid"){
			fun = (e) => { return e.subid == value}
		}

		let res = this.getItems(fun)

		if(res.length > 0){
			res = res[0]
		}

		return res
	}

	getItemByType(type){
		return this.getItems((e) => { return e.type == type})
	}

	getItemByCat(cat){
		return this.getItems((e) => { return e.cat == cat})
	}

	getItemByTypeCat(type, cat){
		return this.getItems((e) => { return e.type == type && e.cat == cat})
	}

	getItemIndex(fn=null){
		fn = fn ? fn : (x) => { return x.id === id }

		return this.items.findIndex(fn);
	}
	
	/**
	 * 
	 * @param {*} fn 
	 * example
	 * getItemIndexes(function(acc, curr, index) {
			if (curr < 10) {
			acc.push(index);
			}
			return acc;
		})
	* 
	*/
	
	getItemIndexes(fn=null){
		fn = fn ? fn : function(acc, curr, index) {
			if (curr < 10) {
			acc.push(index);
			}
			return acc;
		}

		return this.items.reduce(fn, [])
	}
	
	getPaymentIndexes(){
		return this.getItemIndexes(function(acc, val, index) {
			if(val.type === "payment"){
				acc.push(index);
			}
			
			return acc;
		})
	}

	setDirectPay(){
		this.payLater = false
	}

	setPaylater(){
		let idxs = this.getPaymentIndexes()
		let ctx = this
		idxs.forEach((e) => {
			ctx.items[e].price = 0
		})

		this.payLater = true

		return this
	}

	getItemIndexById(id){
		return this.getItemIndex((x) => { return x.id === id })
	}

	getMenuLen(){
		let menulen = this.getItemByCat("menu")
		return menulen.length
	}

	/**
	 * @param {item} an item of cart instance's items
	 * @param {qty} an optional qty for overiding calcs
	 * 
	 * @returns float
	 */
	calcAggregatedPrice(item, qty=null){
		let price = 0
		qty = qty ? qty : item.qty
		let customTotal = 0

		price = item.price * qty

		if(item.type == "product"){
			customTotal = item.custom ? item.custom.reduce((prev, current) => {
				// prevent NaN to be calculated
				return prev + parseFloat(current.price ? current.price : 0)
			}, 0) : 0
			price += customTotal * qty
		}

		return price
	}

	/**
		* get conditional price based on withAggregatedPrice config
		* 
		* @param {item} an item of cart instance's items
		* 
		* @returns float
		*/
	getConditionalAggPrice(item){
		if(this.withAggregatedPrice){
			return this.calcAggregatedPrice(item)
		}else{
			return item.price
		}
	}

	createItemObject({id, subid=null, price, qty=1, type="Item", cat="pay", code="-", note="", 
		data=null, custom=null, aggPrice=null, isTakeaway=false}
	){
		let p = {
			id: id,
			subid: subid ? subid : id,
			type: type,
			cat: cat,
			code: code,
			price: price, // a.k.a. value
			// aggregated price
			aggPrice: aggPrice ? aggPrice : 0,
			note: note,
			custom: custom ? custom : [],
			qty: qty,
			isTakeaway: isTakeaway
		}

		if(data){
			p.data = data
		}
		
		return p
	}

	/*
	.createTableItem({
		qty: 1, 
		price: 30000,
	})
	*/
	createTableItem({id="table", subid=null, price=30000, qty=1, 
		type="product", 
		cat="table", 
		code="-", data=null, custom=null}){
		return this.createItemObject({
			id: id,
			subid: subid ? subid : id, 
			price: price,
			qty: qty, 
			type: type, 
			cat: cat, 
			code: code, 
			data: data
		})
	}

	createPaymentItem({id="p", subid=null, price=30000, qty=1, 
		type="payment", 
		cat="cash", 
		code="-", data=null, custom=null}){
		return this.createItemObject({
			id: id,
			subid: subid ? subid : id, 
			price: price,
			qty: qty, 
			type: type, 
			cat: cat, 
			code: code, 
			data: data
		})
	}

	// qty absolut or as delta
	// to do : obj arg {}
	// e.addItem(id, null, -(prod.qty - val), prod.type, prod.cat, prod.code)
	addItem(id, price, qty=1, type="Item", cat="pay", code="-", data=null, subid=null, note=""){

		let p = this.createItemObject({
			id: id,
			subid: subid ? subid : id, 
			price: price,
			qty: qty, 
			type: type, 
			cat: cat, 
			note: note,
			code: code, 
			data: data
		})

		this.addOrUpdateItem(id, p)
		// this.callbacks.addItem(this, p)

		return this
	}

	// data = copied object, plz do not use reference var
	addOrUpdateItem(id, data=null, merge=false){
		let idx = 0

		let igroup = this.itemGrouping
		let isDefault = igroup === "default" || igroup === "by-id"

		if(isDefault){
			idx = this.items.findIndex( x => x.id === id );
		}else if(igroup === "byid-subid"){
			idx = this.items.findIndex( x => x.subid === data.subid );
		}
		let qty = data.qty
		
		if(idx >= 0){
			this.items[idx].qty += qty
			if(this.items[idx].qty <= 0){
				this.removeItemById(data.id);
			}
			let tempQty = this.items[idx].qty
			data.qty = tempQty
			
			if(this.replaceAfterModify){
				this.items[idx] = {...data}
			}
			
			this.callbacks.addItem(this, this.items[idx])

			return
		}

		let p = this.createItemObject(data)

		this.items.push(p)
		this.callbacks.addItem(this, p)
	}

	addOrReplaceItem(id, data=null, merge=false){
		let idx = 0

		let igroup = this.itemGrouping
		let isDefault = igroup === "default" || igroup === "by-id"

		if(isDefault){
			idx = this.items.findIndex( x => x.id === id );
		}else if(igroup === "byid-subid"){
			idx = this.items.findIndex( x => x.subid === data.subid );
		}
		let qty = data.qty
		
		let p = this.createItemObject(data)

		if(idx >= 0){
			this.items[idx] = p
			this.callbacks.addItem(this, this.items[idx])

			return
		}

		this.items.push(p)
		this.callbacks.addItem(this, p)
	}

	addItemObject(id, data=null){
		let p = { ...data, id: id }

		this.items.push(p)
		this.callbacks.addItem(this, p)

		return this
	}

	addItemNote(idx, note){
		this.items[idx].note = note
		this.items[idx].data.note = note

		this.callbacks.addItemNote(this)

		return this
	}

	appendItemNote(idx, note){
		this.items[idx].note += note
		// this.items[idx].data.note += note

		this.callbacks.addItemNote(this)

		return this
	}

	// unstable
	addItemCustom(idx, custom=[]){
		this.items[idx].custom = custom
		this.items[idx].data.custom = custom

		this.callbacks.addItemCustom(this)

		return this
	}

	// stable
	appendItemCustom(idx, custom){
		this.items[idx].custom.push(custom)
		// this.items[idx].data.custom.push(custom)

		this.callbacks.appendItemCustom(this)

		return this
	}

	// stable
	updateItemCustomById(idx, id, custom){
		this.items[idx].custom = this.items[idx].custom.map((e)=>{
			if(e.id == id){
				e = custom
			}
			return e
		})
		// this.items[idx].data.custom.push(custom)

		this.callbacks.updateItemCustomById(this)

		return this
	}

	// stable
	/*
	pos.cartManager.appendOrUpdateItemCustom(idx, $el.val(), {
		id: $el.val(),
		mid: $el.attr("data-mid"),
		name: $el.attr("data-name"),
		price: parseInt($el.attr("data-price")),
		note: ""
	})
	idx = item index
	*/
	appendOrUpdateItemCustom(idx, id, custom){
		let item = this.getItemCustomById(idx, id)
		cl([item, custom])

		if(item.length > 0){
			this.updateItemCustomById(idx, id, custom)
		}else{
			this.appendItemCustom(idx, custom)
		}

		if(custom.note){
			this.items[idx].note = custom.note
		}

		this.callbacks.appendOrUpdateItemCustom(this)

		return this
	}

	// stable
	filterItemCustom(idx, condition=null){
		condition = condition || function(e){ return true }

		return this.items[idx].custom.filter(condition)
	}

	getItemCustomByIdx(idx){
		return this.filterItemCustom(idx, (e) => true)
	}

	getItemCustomById(idx, id){
		return this.filterItemCustom(idx, 
			(e) => e.id == id
		)
	}

	// stable
	removeItemCustomById(idx, id){
		this.items[idx].custom = this.filterItemCustom(idx, 
			(e) => { return e.id != id}
		)

		this.callbacks.removeItemCustom(this)

		return this
	}

	getItemCustomStr(item){
		let st = []
		item.custom.forEach((e)=>{
			st.push(e.name ? e.name : e.note);
		})
		return st.join(", ")
	}

	// todo
	subItem(id){
		let idx = this.items.findIndex( x => x.id === id );
		if(idx < 0){
			throw new Error("No such Item")
		}

		let p = this.items[idx]

		this.addItem(id, p.price, -1, data=p.data)

		return this
	}

	updateItemByIdx(idx, e){
		this.items[idx] = e
		return this
	}

	removeItemById(id){
		return this.removeItem((e) => { return e.id != id})
	}
	
	removeItemByItemGrouping(value){
		let igroup = this.itemGrouping
		let isDefault = igroup === "default" || igroup === "by-id"

		let fun = (e) => { return e.id != value}
		
		if(igroup === "byid-subid"){
			fun = (e) => { return e.subid != value}
		}

		return this.removeItem(fun)
	}

	removeItemByType(type){
		return this.removeItem((e) => { return e.type != type})
	}

	removeItemByCat(cat){
		return this.removeItem((e) => { return e.cat != cat})
	}

	removeItemByTypeCat(type, cat){
		return this.removeItem((e) => { return (e.type != type && e.cat != cat)})
	}

	removeItem(f=null){
		if(!f){
			f = (e) => { return e.id != id}
		}

		this.items = this.getItems(f)
		this.callbacks.removeItem(this)

		return this
	}

	getSubtotal(){
		return this.subtotal
	}

	// with calculation
	getTotalCalcs(){
		let items = this.getItemByTypeCat("product", "menu")
		
		if(items.length <= 0){
			return 0
		}

		return items.reduce((prev, current) => {
			return prev + parseFloat(current.price)
		}, items[0].price)
	}

	// without calculation
	getTotal(){
		this.callbacks.getTotal(this)

		return this.total
	}
	
	calcTax(v=0){
		return v*0.1
	}

	getTax(){
		return (this.total * 0.1)
	}

	getTotalWithTax(){
		this.callbacks.getTotal(this)
		let total = this.total

		return total + (total * 0.1)
	}

	getConditionalTotal(){
		if(this.shouldWithTax){
			return this.getTotalWithTax()
		}

		return this.getTotal()
	}

	iterate(){
		this.callbacks.iterate(this)

		return
	}

	resetTotals(){
		this.subtotal = 0
		this.total = 0

		return this
	}

	/*
	cart to cart ops
	substract current cart by arg cart
	*/
	substractItemsByCart(cart){
		let ctx = this
		cart.items.forEach((e)=>{
			let cItem = ctx.getItemByItemGrouping(e.subid)
			let qleft = cItem.qty - e.qty
			
			if(qleft < 1 || isNaN(qleft)){
				ctx.removeItemByItemGrouping(e.subid)
			}else{
				cItem.qty = qleft
				ctx.addOrReplaceItem(null, cItem)
			}
		})
		this.callbacks.substractItemsByCart(this)

		return this
	}

	// convert order detail data from db to cart item arr
	transformDbDetailToCartItems(arr){
		const ctx = this
		return arr.map((e,i) => {
			let price = 0

			if(e.type == "product"){
				price = e.val_prod
			}else if(e.type == "payment"){
				price = e.val_pay
			}

			return ctx.createItemObject({
				id: e.id, 
				subid: e.subid, 
				price: price, 
				qty: e.qty,
				type: e.type,
				cat: e.cat,
				code: e.code,
				note: e.note,
				data: e,
				// todo
				custom: null,
			})
		})
	}

	clear(){
		this.items = []
		this.callbacks.clear(this)
		this.resetTotals()
	}
}

class TableManager extends Cart{
	
}

class VoucherManager extends Entity{
	callbacks = {}

	constructor(){
		super()
		this.setDefaultCallback()
	}

	all(){

	}

	calculate(){

	}
}

class POS extends Entity{
	id = ""
	cartManager = null
	voucherManager = null
	Items = []
	callbacks = {}
	taxRate = 0.1
	checkoutData = {}
	checkoutDataSend = {}
	payMethods = ["-", "cash", "card", "emoney", "qris"]

	constructor(){
		super()
		this.setDefaults().setDefaultCallback()
	}

	setDefaults(){
		this.cartManager = new Cart()
		this.voucherManager = new VoucherManager()
		this.items = []

		return this
	}

	setDefaultCheckoutData(){
		this.checkoutData = {
			type: "dine-in",
			subtype: "",
			order: {},
			customer:{},
			courier:{},
			cart: [],
			payment:{
				id:"cash",
				amt:null,
			},
			reservations: {
				dt1: null,
				dt2: null,
				tables: [],
			}
		}
		this.checkoutDataSend = this.checkoutData

		return this
	}

	applyCartManager(cm){
		this.setCartManager(cm)
		cm.iterate()
		
		return this
	}

	setCartManager(cm){
		this.cartManager = cm

		return this
	}

	setVoucherManager(vm){
		this.voucherManager = vm

		return this
	}

	checkout(){
		this.callbacks.checkout(this)
	}
}

// let cart = new Cart()
/*

// todo
base class for pos instance decorator

reference & inspired by php object decorator 
https://sourcemaking.com/design_patterns/decorator/php

todo: remove / move all gl var dependencies
gl is global object declared @cashier/pos/index-r1

*/
class POSDecorator{
	pos = null
	totals = 0
	isOjol = false
	isPartialPay = false
	withTaxAndGroup = true
	tblSelected = []

	// unstructured arg for multi processes
	arg = {}

	// POS instance
	setInstance(pos){
		this.pos = pos

		return this
	}
	
	setCartInstance(cart){
		this.pos.cartManager = cart

		return this
	}
	
	setArg(arg){
		this.arg = arg

		return this
	}

	setWithTaxAndGroup(withTaxAndGroup){
		this.withTaxAndGroup = withTaxAndGroup ? true : false

		return this
	}

	// transform to simplest form of checkout payload
	/* 
	calee : cash pos ::
	pos.checkoutDataSend = await posDecorator.translateData(
		"checkout",
		pos.checkoutData
	);
	*/
	async translateData(t="", arg){
		let ret = null
		let pos = this.pos
		
		let isOjol = pos.checkoutData.type === "ojol"

		switch(t){
			case "checkout":
			default:
				// try{
					// checkout code here
			break;
		}

		return ret
	}

	/**
		*  @return bool
	*/
	shouldHaveSelectedTable(){
		let tblSelected = this.tblSelected
		let isPartialPay = this.isPartialPay
		let mandatoryTable = this.mandatoryTable
		let $orderId = $("input[name=order_id]").val()
		let emptyOid = $orderId == ''

		return mandatoryTable && tblSelected.length < 1 && !isPartialPay && emptyOid
	}
	
	/**
		*  @return bool
	*/
	shouldWithCustomerData(){
		let $orderId = $("input[name=order_id]").val()
		let emptyOid = $orderId == ''
		
		let isOjol = this.isOjol

		return !gl.customer.id && !isOjol && emptyOid
	}

	async setupTaxAndGroup(){
		if(!this.withTaxAndGroup){
			return
		}

		let arg = this.arg
		let pos = this.pos

		await act("cart-add-tax")
		await act("cart-add-group")

		let taxs = pos.cartManager.getItemByCat("tax")
		let groups = pos.cartManager.getItemByCat("group")

		if(taxs != []){
			let tax = taxs[0]
			if(tax){
				$("#coTax").text(
					util.currencyFloatFmt(gl.order.tax)
				)
			}else{
				$("#coTax").text(util.currencyFloatFmt(0))
			}
		}

		let grCount = 0
		let coGroup = await groups.map((e)=>{
			grCount += parseInt(e.qty)
			return e.data.code.toUpperCase() + "-" + e.qty
		}).join(", ")

		$("#coGroup").html(`Rombongan (${grCount}): ` + coGroup)
	}

	/*
	standard checkout preview event
	todo: remove / move gl var dependencies
	gl is global object declared @cashier/pos/index-r1
	*/
	async standardCheckoutEvent(){
		let arg = this.arg
		let tblSelected = null
		let resp
		let pos = this.pos

		// set checkout data & default payment 2 cash
		// todo: validate
		let isOjol = pos.checkoutData.type === "ojol"
		this.isOjol = isOjol

		if(this.shouldWithCustomerData()){
			alert("Mohon pilih pelanggan dahulu!")
			return
		}

		tblSelected = getSelectedTable()
		this.tblSelected = tblSelected

		// todo: delete -    -    -    -
		let isPartialPay = arg.order_id != undefined;

		this.isPartialPay = isPartialPay

		if(isPartialPay){
			await act("cart-reset-product")
			pos.cartManager.addItem("part-pay", arg.amt, 1, "product", "part-pay", null, {
				name: "part payment"
			})
			pos.checkoutData.order.id = arg.order_id
		}
		// ./todo: delete -    -    -    -

		let orderType = $("[name=ordertype]").val()
		let mandatoryTable = orderType == "dine-in" || orderType == "dine in"
		this.mandatoryTable = mandatoryTable

		if(orderType == '' || !orderType == null){
			alert("Mohon pilih tipe pesanan dahulu!")
			return
		}

		// if(mandatoryTable && tblSelected.length < 1 && !isPartialPay){
		if(this.shouldHaveSelectedTable()){
			alert("Mohon pilih meja dahulu!")
			return
		}

		let totals = pos.cartManager.getTotal()

		// todo: condition without tax & group
		this.setupTaxAndGroup()

		if(arg.itemFrom == "split"){
			setupCartTable(dtCheckout, splitCart, "co")
		}else if(arg.itemFrom == "db"){
			let $orderIdval = $("input[name=order_id]").val()
			let res = await getSingleOrder($orderIdval)

			if(!res){
				alert("Error: order tidak ada. id:"+$orderIdval)
				return
			}

			// dont recalculate the price
			cartTemp.setWithAggregatedPrice(false)
			cartTemp.items = cartTemp.transformDbDetailToCartItems(res.data.details)
			setupCartTable(dtCheckout, cartTemp, "co")
			cartTemp.setWithAggregatedPrice(true)
		}else{
			setupCartTable(dtCheckout, pos.cartManager, "co")
		}

		// todo : fix bug voucher value
		await act("cart-add-voucher")

		// todo: handle eq null
		pos.checkoutData.cart = pos.cartManager.items
		pos.checkoutData.customer = gl.customer
		pos.checkoutData.reservations.dt1 = gl.tbdtime1
		pos.checkoutData.reservations.dt2 = gl.tbdtime2
		pos.checkoutData.reservations.tables = tblSelected

		// check by api
		try{
			resp = await act("checkout-preview", arg)
			if(!resp.success){
				// todo prevent recursive loop
				console.log(resp)
				// $("#btCancelVoucher").click()
				return
			}
		}catch(e){
			/* 
			todo: 
			- inf loop problem. break implicit loop
			- handle cleaer voucher alternate to bt cancel click
			*/
			// $("#btCancelVoucher").click()
			return
		}


		let pdata = resp.data

		gl.order = {...gl.order,
			totals: pdata.total,
			subtotal: pdata.subtotal,
			tax: pdata.tax,
		}

		totals = gl.order.totals

		// calc voucher
		let voucher = gl.voucher
		let sale = 0
		if(voucher && voucher.type){
			isAbsolute = voucher.type == "absolute";
			sale = pdata.discountAmt

			// if(isAbsolute){
			// 	sale = voucher.value
			//     totals -= sale
			// }else{
			//     sale = parseFloat(voucher.value/100 * totals)
			//     sale = sale > voucher.max_disc ? voucher.max_disc : sale;

			//     totals -= sale
			// }
			cl("voucher digunakan")
			cl(voucher)
			$("#coVoucher").text(util.currencyFloatFmt(sale))
		}else{
			$("#coVoucher").text(util.currencyFloatFmt(0))
		}

		$("input[name=pvvouchernom]").val(0).trigger("change")
		$("input[name=pvvoucherpersen]").val(0).trigger("change")

		$("input[name=pvvouchernom]")
		// plz do not declare event triggering here
			/* .off()
			.change(function() {
			let total = parseInt(sale) + 
				parseInt(numeral($("input[name=pvvouchernom]").val()).value()) + 
				((parseInt($("input[name=pvvoucherpersen]").val()) / 100) * gl.order.subtotal)
			$("#coVoucher").text(util.currencyFloatFmt(total))  
		}) */

		$("input[name=pvvoucherpersen]")
			/* .off()
			.change(function() {
			let total = parseInt(sale) + parseInt(numeral($("input[name=pvvouchernom]").
				val()).value()) +
				((parseInt($("input[name=pvvoucherpersen]").val()) / 100) * gl.order.subtotal)
			$("#coVoucher").text(util.currencyFloatFmt(total))
		}) */

		// set checkout previews
		$("#coTotal").text(util.currencyFloatFmt(totals))

		// setup default payment @pvcash
		setTimeout(()=>{
			$("input[name=pvcash]").val(totals).trigger('change')
			$("input[name=paymenttype][value=cash]").click()
		}, 400)

		$("[name=pay_val]").val(gl.order.totals)

		$("#coSubtotal").text(
			util.currencyFloatFmt(gl.order.subtotal)
		)
		$("#coTax").text(
			util.currencyFloatFmt(gl.order.tax)
		)

		// set group & table detail
		// prev tbl
		let tbCount = tblSelected.length
		
		let t1 = util.toDatetimeLocale(gl.tbdtime1)
		let t2 = util.toDatetimeLocale(gl.tbdtime2)
		let atTime = t1+" - "+t2
		// let atTime = ""

		$("#coCustomer").html(gl.customer.name)
		
		$("#coTable").html(`Meja (${tbCount}): ` + tblSelected.map((e)=>{
			return e.id+"-"+e.name
		}).join(", "))
		
		// $("#coTime").text("Waktu: "+atTime)
		$("#coTime1").text(t1)
		$("#coTime2").text(t2)

		$("#coPayAmt").text(util.currencyFloatFmt(totals))
		$("#coPayName").text(pos.checkoutData.payment.id)
		$("#modal-checkout").modal()
	}
}
