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

// conditional parsefloat
String.prototype.cparseFloat = function () {
	const numericValue = parseFloat(this);
	return isNaN(numericValue) ? this.toString() : numericValue;
};

/**
 * @adibenc
 * 
 * @param {*} attribute 
 * @returns 
 */

Array.prototype.noNull = function() {
	return this.filter(item => item !== null);
};

// conditional no null
Array.prototype.cnoNull = function(attr=[]) {
	return this.filter(item => {
		let cond = true

		attr.forEach((e2)=>{
			cond = cond && item[e2] !== null
		})
		
		return cond
	});
};

Array.prototype.groupBy = function(attributes) {
	return this.reduce((result, item) => {
		// Ensure that attributes is always an array
		let key = Array.isArray(attributes)
		? attributes.map(attr => item[attr]).join(',')
		: item[attributes];
		
		if (!result[key]) {
			result[key] = [];
		}
		
		result[key].push(item);
		return result;
	}, {});
};


// multi col agregate group by
Array.prototype.groupByAgg = function (attributes, 
	{ agg = true, aggCols = [],
		// defaultKey = "L1"
		defaultKey = "-"
	}) {
	agg = agg || true;
	aggCols = aggCols.length > 0 ? aggCols : ["ptd_target", "ptd_actual"];

	return this.reduce((result, item) => {
		let key = Array.isArray(attributes)
		? attributes.map(attr => item[attr]).join(',')
		: item[attributes];
	
	if(!key){
		key = defaultKey
	}

	if (!result[key]) {
		result[key] = {
			values: [],
			aggregate: {},
		};
	}

	result[key].values.push(item);

	if (agg) {
		if (Object.keys(result[key].aggregate).length === 0) {
			// Initialize aggregate with 0 for each specified column
			for (const col of aggCols) {
				result[key].aggregate[col] = 0;
			}
		}

		for (const col of aggCols) {
			const value = parseFloat(item[col]);
			if (!isNaN(value)) {
				result[key].aggregate[col] += value;
			}
		}
	}

	return result;
	}, {});
};
  
Array.prototype.first = function() {
	return this.length > 0 ? this[0] : null;
}

  
function getMonth(index) {
	index = parseInt(index)
	const indonesianMonths = [
	  "Jan",
	  "Feb",
	  "Mar",
	  "Apr",
	  "Mei",
	  "Jun",
	  "Jul",
	  "Agu",
	  "Sep",
	  "Okt",
	  "Nov",
	  "Des",
	];
  
	if (index >= 1 && index <= 12) {
	  return indonesianMonths[index - 1]; // Adjust for 0-based array indexing
	}
	
	return null;
}

const cl = console.log;

// arr / list / collection utils

/**
 * zip arrays / list just like in python's zip
 * chatgpt
 * 
 * @param {*} arrays 
 * @returns 
 * 
 */
function zip(arrays) {
	// Find the length of the shortest array
	const minLength = Math.min(...arrays.map((arr) => arr.length));

	// Create an array to hold the zipped result
	const result = [];
  
	for (let i = 0; i < minLength; i++) {
	  // Create a sub-array for each position in the result
	  const subArray = arrays.map((arr) => arr[i]);
	  result.push(subArray);
	}
  
	return result;
}

function setupS2($el){
	$el.select2({
		placeholder: $el.attr("data-s2ph"),
		allowClear: true,
	})
}