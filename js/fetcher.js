/**
 * 
 * 
 * by adib-enc
 * 
 * 
 */
class Fetcher{
    method = "get"
    xcsrfToken = ""

    constructor(){
        this.setDefaultHeader()
    }

    setXcsrfTokenFromMeta(){
        this.xcsrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        return this
    }

    setXcsrfToken(token){
        this.xcsrfToken = token
        return this
    }

    getXcsrfToken(){
        return this.xcsrfToken
    }

    setDefaultHeader(){
        var ctx = this

        this.setXcsrfTokenFromMeta()
        this.header = {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": ctx.getXcsrfToken()
        }

        return this
    }

    getHeader(){
        return this.header
    }

    get(url, body= {}){
        return this.do('get', url, body)
    }

    post(url, body = {}){
        return this.do('post', url, body)
    }

    put(url, body = {}){
        return this.do('put', url, body)
    }

    do(method, url, body){
        var ctx = this
        return fetch(url, {
            headers: ctx.getHeader() ,
            method: method,
            credentials: "same-origin",
            body: JSON.stringify(body)
        }).then(response=>response.json())
    }
    /*
        .then((data) => {
            window.location.href = redirect;
        })
        .catch(function(error) {
            console.log(error);
        });
    */
}