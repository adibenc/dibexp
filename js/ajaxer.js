class Ajaxer{
    contentType = false

    constructor(){

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

		util.setLoading(true)

        return $.ajax(conf);
    }

    defaultC1(){
        return function(response) {
            util.setLoading(false)
        }
    }
    
    defaultE1(){
        return function(xhr) {
            if(xhr.responseJSON){
                alert(xhr.responseJSON.message);
                return
            }
			util.setLoading(false)

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

// /*test

var ajaxer = new Ajaxer()
// declare if with x-csrf
ajaxer.withCsrf()

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