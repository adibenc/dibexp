var range = function(start, end, step) {
	var range = [];
	var typeofStart = typeof start;
	var typeofEnd = typeof end;

	if (step === 0) {
		throw TypeError("Step cannot be zero.");
	}

	if (typeofStart == "undefined" || typeofEnd == "undefined") {
		throw TypeError("Must pass start and end arguments.");
	} else if (typeofStart != typeofEnd) {
		throw TypeError("Start and end arguments must be of same type.");
	}

	typeof step == "undefined" && (step = 1);

	if (end < start) {
		step = -step;
	}

	if (typeofStart == "number") {

		while (step > 0 ? end >= start : end <= start) {
			range.push(start);
			start += step;
		}

	} else if (typeofStart == "string") {

		if (start.length != 1 || end.length != 1) {
			throw TypeError("Only strings with one character are supported.");
		}

		start = start.charCodeAt(0);
		end = end.charCodeAt(0);

		while (step > 0 ? end >= start : end <= start) {
			range.push(String.fromCharCode(start));
			start += step;
		}

	} else {
		throw TypeError("Only string and number types are supported");
	}

	return range;
}

function sleep(millis) {
	return new Promise(resolve => setTimeout(resolve, millis));
}

const cl = console.log
const ce = console.error

Array.prototype.noNull = function() {
	return this.filter(item => item !== null);
};
Array.prototype.first = function() {
	return this.length > 0 ? this[0] : null;
}

const constants = {
	kl: {
		pns: "PNS",
		tni_ad: "TNI AD",
		tni_au: "TNI AU",
		tni_al: "TNI AL",
		polri: "POLRI",
	}
}

// blend of jquery stuffs
class JQUtil{
	static setup(t=null){
		switch(t){
			// set all select to select2
			case "s2a":
				$("select").select2()
			break
		}
	}
}