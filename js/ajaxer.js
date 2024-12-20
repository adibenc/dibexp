class Ajaxer{
    contentType = false
    callbacks = {
        beforeRequest: function(arg){},
        afterRequest: function(arg){},
    }

    constructor(){

    }

    setCallbacks(callbacks={}){
        this.callbacks = callbacks

        return this
    }

    setContentType(ct){
        this.contentType = ct

        return this
    }
    
    setNullContentType(){
        return this.setContentType(null)
    }

    resetContentType(){
        return this.setContentType(false)
    }
    
    setJsonContentType(){
        return this.setContentType("application/json")
    }

    getContentType(){
        return this.contentType
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

    // "GET"
    doReq(method, url, data, succCallback = null, errCallback = null){
        const ctx = this

        this.callbacks.beforeRequest(this)

        if(!succCallback){
            succCallback = this.defaultC1()
        }
        if(!errCallback){
            errCallback = this.defaultE1()
        }
        let ct = ctx.getContentType()
        let conf = {
            type: method,
            url: url,
            cache: false,
            data: ct == "application/json" ? JSON.stringify(data) : data,
            success: succCallback,
            processData: false,
            contentType: ct,
            error: errCallback
        }

		// util.setLoading(true)
        this.callbacks.afterRequest(this)

        return $.ajax(conf);
    }

    defaultC1(){
        return function(response) {
            // util.setLoading(false)
        }
    }
    
    defaultE1(){
        return function(xhr) {
            if(xhr.responseJSON){
                alert(xhr.responseJSON.message);
                return
            }
			// util.setLoading(false)

            console.log(xhr)
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

const intercept = (callback) => {
    let send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
      this.addEventListener('readystatechange', function() {
        callback(this);
        /* if (this.responseURL.includes(urlmatch) && this.readyState === 4) {
        } */
      }, false);
      send.apply(this, arguments);
    };
};
  
// /*test

var ajaxer = new Ajaxer()
// declare if with x-csrf
ajaxer.withCsrf()

ajaxer.setCallbacks({
    beforeRequest: function(arg) {
        // locker.sets("dm")
        Blocker.blockEl("#mainContent")
        Blocker.blockEl(".table-responsive")
    },
    afterRequest: function(arg) {
        // locker.sets("em")
        Blocker.unblockEl("#mainContent")
        Blocker.unblockEl(".table-responsive")
    },
})

/*
ajaxer.get( callurl , null, 
    function(response){
        if(response.success){
            
        }else{
            console.log(response.message)
        }
    },
)
*/