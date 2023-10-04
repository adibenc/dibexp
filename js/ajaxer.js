class Ajaxer{
	callbacks = {
		beforeRequest: function(arg){},
		afterRequest: function(arg){},
	}
	
	withCsrf(){
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
				// Authorization: "Bearer "+access_token
			}
		});

		return this
	}

	setCallbacks(callbacks={}){
		this.callbacks = callbacks

		return this
	}
	// "GET"
	async doReq(method, url, data, succCallback = null, errCallback = null){
		this.callbacks.beforeRequest(this)

		if(!succCallback){
			succCallback = this.defaultC1()
		}
		if(!errCallback){
			errCallback = this.defaultE1()
		}
		var ret = await $.ajax({
			type: method,
			url: url,
			cache: false,
			data: data,
			success: succCallback,
			processData: false,
			contentType: false,
			error: errCallback
		});;

		this.callbacks.afterRequest(this)

		return ret
	}

	defaultC1(){
		return function(response) {
			
		}
	}
	
	defaultE1(){
		return function(xhr) {
			alert(xhr.responseJSON.message);
		}
	}

	get(url, data, succCallback = null, errCallback = null){
		return this.doReq("GET", url, data, succCallback, errCallback)
	}

	post(url, data, succCallback = null, errCallback = null){
		console.log(data)
		return this.doReq("POST", url, data, succCallback, errCallback)
	}

	put(url, data, succCallback = null, errCallback = null){
		data._method = "PUT"
		return this.doReq("PUT", url, data, succCallback, errCallback)
	}

	patch(url, data, succCallback = null, errCallback = null){
		data._method = "PATCH"
		// console.log(data)
		data.append("_method", "PATCH");
		return this.doReq("PATCH", url, data, succCallback, errCallback)
	}

	delete(url, data, succCallback = null, errCallback = null){
		return this.doReq("DELETE", url, data, succCallback, errCallback)
	}
}

var ajaxer = null;

if(true){
	ajaxer = new Ajaxer();
}

/*

var ajaxer = new Ajaxer()
// declare if with x-csrf
ajaxer.withCsrf()

ajaxer.get( callurl , null, 
	function(response){
		if(response.success){
			
		}else{
			console.log(response.message)
		}
	},
)
*/