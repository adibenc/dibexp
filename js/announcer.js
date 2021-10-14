var print = console.log

/**
 * 
 * 
 * by adib-enc
 * 
 * 
 */
class NumberSpeller{
    audioList = []
    files = []

    baseSpelling = {}
    spellingMap = {}

    getBaseSpelling() {
        return ["kosong", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"]
    }

    getSpellingObj() {
        return {
            "kosong":"0.wav", 
            "satu":"1.wav", 
            "dua":"2.wav", 
            "tiga":"3.wav", 
            "empat":"4.wav", 
            "lima":"5.wav", 
            "enam":"6.wav", 
            "tujuh":"7.wav", 
            "delapan":"8.wav", 
            "sembilan":"9.wav", 
            "se":"se.wav", 
            "puluh":"puluh.wav", 
            "belas":"belas.wav",
            "ratus":"ratus.wav",
            "ribu":"ribu.wav",
        }
    }

    async play(file){
        try{
            var audio = new Audio(file);
            await audio.play();
            return audio;
        }catch(e){
            console.log("err::"+file)
        }
    }

    resetFiles(){
        this.files = []

        return this
    }

    setFiles(files){
        this.files = files
    }
    
    pushFile(file){
        this.files.push(file)
    }
    
    spell(value) {
        var value = Math.abs( parseInt(value));
        var huruf = this.getBaseSpelling();
        var localFile = this.getSpellingObj()

        var temp = "";
        if (value < 12) {
            temp = " " + huruf[value];
            if(value > 10){
                if(value == 11){
                    this.pushFile(localFile["se"])
                }
                this.pushFile(localFile["belas"])
            }else if(value == 10){
                this.pushFile(localFile["se"])
                this.pushFile(localFile["puluh"])
            }else{
                this.pushFile(localFile[huruf[value]])
            }
        } else if (value <20) {
            temp = this.spell(value - 10)
            this.pushFile(localFile[value - 10])
            temp += " belas";
            this.pushFile(localFile["belas"])
        } else if (value < 100) {
            temp = this.spell(value/10)
            temp += " puluh"
            this.pushFile(localFile["puluh"])
            temp += this.spell(value % 10);
        } else if (value < 200) {
            temp = " seratus"  
            this.pushFile(localFile["se"])
            this.pushFile(localFile["ratus"])
            temp += this.spell(value - 100);
        } else if (value < 1000) {
            temp = this.spell(value/100)  + " ratus"  + this.spell(value % 100);
            this.pushFile(localFile["ribu"])
        } else if (value < 2000) {
            temp = " seribu"  + this.spell(value - 1000);
        } else if (value < 1000000) {
            temp = this.spell(value/1000)  + " ribu"  + this.spell(value % 1000);
        } else if (value < 1000000000) {
            temp = this.spell(value/1000000)  + " juta"  + this.spell(value % 1000000);
        } else if (value < 1000000000000) {
            temp = this.spell(value/1000000000)  + " milyar"  + this.spell(fmod(value,1000000000));
        } else if (value < 1000000000000000) {
            temp = this.spell(value/1000000000000)  + " trilyun"  + this.spell(fmod(value,1000000000000));
        }
        // console.log([value, temp])
        return temp;
    }
}

// audio player
class Player{
    idx = 0
    wait = 1000
    playlist = []
    callbacks = {
        beforePlay: print,
        afterPlay: print,
    }

    setPlaylist(playlistL){
        this.playlist = playlistL
        
        return this
    }

    setCallbacks(args = null){
        let callbacks = {}
        if(args.beforePlay){
            callbacks.beforePlay = args.beforePlay
        }

        if(args.afterPlay){
            callbacks.afterPlay = args.afterPlay
        }

        this.callbacks = callbacks;

        return this
    }

    makePlaylist(list1){
        var ctx = this;

        var playlist = []
        list1.forEach(function(e,i){
            try{
                // var audio = new Audio(file);
                playlist.push(new Audio(e))
            }catch(e){
                console.log("err::" + e)
            }
            // await ctx.play(e)
        })

        return playlist
    }

    async playsUsingEvent(){
        console.log("playsUsingEvent")
        var i = -1
        var sounds = this.playlist
        
        // var f = function(i, sounds) {
        var f = function() {
            i++;
            if (i == sounds.length) return;
            sounds[i].addEventListener('ended', f);
            sounds[i].play();
            print("snc play : ")
            print(sounds)
            print("func play : "+i)
        }
        await f(i, sounds)
    }

    async plays(wait = 1000, idx = 0){
        // var idx = 0
        // var wait = 1000

        var ctx = this;
        var plocal = this.playlist

        if(ctx.idx==0){
            this.callbacks.beforePlay(this)
        }

        var timeout = setTimeout(async function(){
            ctx.idx++;
            try{
                var plocalIdx = plocal[ctx.idx]

                if(plocalIdx){
                    await plocalIdx.play()
                    wait = plocalIdx.duration == NaN ? 1000 : plocalIdx.duration * 1000;
                    ctx.plays(wait, ctx.idx); 

                    // why -2? coz plocal / playlist has 2 elements of padding
                    if((plocal.length-2) == idx){
                        ctx.callbacks.afterPlay(ctx)
                        clearTimeout(timeout);
                        return ctx;
                    }
                }
            }catch(e){
                console.log("err play::"+e)
            }
        }, wait);
        // }, playlist[idx].duration);        
    }
}

// announcer, use player & numberspeller class
class Announcer{
    template = {
        keloketKasir:[
            'no-antrian.wav',
            'silahkan-masuk-ke.wav',
            'loket-kasir.wav'
        ],
        keloket:[
            'no-antrian.wav',
            'silahkan-masuk-ke.wav',
            'loket.wav'
        ],
    }

    callbacks = {
        player: {
            beforePlay: print,
            afterPlay: print,
        }
    }

    queue = null
    player = null

    // if true, then dont play sound
    isLocked = false

    sentence = []

    constructor(){
        this.player = new Player()
    }

    setCallbacks(args = null){
        let callbacks = {}

        if(args.player){
            if(!callbacks.player){
                callbacks.player = {}
            }

            if(args.player.beforePlay){
                callbacks.player.beforePlay = args.player.beforePlay
            }
    
            if(args.player.afterPlay){
                callbacks.player.afterPlay = args.player.afterPlay
            }

            this.player = this.player.setCallbacks(callbacks.player) 
        }

        this.callbacks = callbacks;

        return this
    }

    assemble(template = "", arg = {}){
        var ctx = this
        switch(template){
            case "keloket":
                var tl = this.template["keloket"]
                // console.log(tl)
                // console.log(tl[0])
                this.sentence.push("") // add padding, dont delete
                this.sentence.push(tl[0])
                
                arg.angka.forEach(function(e,i){
                    ctx.sentence.push(e)
                })

                this.sentence.push(tl[1])
                this.sentence.push(tl[2])
                
                arg.loket.forEach(function(e,i){
                    ctx.sentence.push(e)
                })
            break;
        }
        
        return this
    }

    resetSentence(){
        this.sentence = []

        return this
    }
    
    setDir(dir){
        this.dir = dir
        
        return this
    }

    getDir(){
        return this.dir
    }

    makePlaylist(vals = []){
        var player = new Player()
        var dir = this.getDir()

        var audios = vals.map(function(e){
                return dir + e
            }
        )

        this.playlist = player.makePlaylist( audios );
        return this;
    }

    callLoket(num = 0, loket = 1){
        this.resetSentence()
        var nSpeller = new NumberSpeller()
        
        nSpeller.spell(num)
        var st1 = nSpeller.files
        
        nSpeller.resetFiles().spell(loket)
        var st2 = nSpeller.files
        
        var audios = this.assemble("keloket", {
            angka: st1,
            loket: st2
        })
        
        this.makePlaylist(this.sentence).call()
    }

    call(){
        var player = this.player
        
        if(!this.isLocked){
            player.setPlaylist(this.playlist).plays()
        }else{
            print("announcer locked / muted!")
        }
        // player.setPlaylist(this.playlist).playsUsingEvent()
    }
}

noth = function(arg){
}

// antrian, use announcer class
class Queue{
    // int
    current = {
        id: 0,
        pending: 0,
        finished: 0,
        num: 1,
    }
    id = null
    announcer = null
    name = "q1"
    desc = "q1 desc"
    role = "admin"
    kodeLoket = ""

    autoAnnounce = false
    autoChange = true
    successAjax = false

    prefix = "layanan"
    doms = {
        pending: "pending",
        max: "max",
        next: "next",
        called: "called",
    }

    callbacks = {
        next: noth,
        previous: noth,
        announce: noth,
        refresh: noth,
        retry: noth,
        print: noth,
        take: noth,
    }

    callbacksAfterAnnounce = {
        next: noth,
        previous: noth,
        announce: noth,
        refresh: noth,
        retry: noth,
        print: noth,
        take: noth,
    }

    constructor(id=0, name = "q1", desc = "q1 desc", ann = null){
        var annDefault = (new Announcer()).setDir(window.location.origin + '/assets/announcer/')
        this.setAnnouncer( ann ? ann : annDefault )
        this.id = id
        this.name = name
        this.desc = desc
    }

    setDomValues(){
        var pref = this.prefix
        var id = this.id
        var current = this.current
        // console.log(current)

        var curnum = current.num < 0 ? 0 : current.num

        $(`#${pref}${id}${this.doms.pending}`).text(current.pending)
        $(`#${pref}${id}${this.doms.max}`).text(curnum)
        $(`#${pref}${id}${this.doms.next}`).text(this.getNext())
        $(`#${pref}${id}${this.doms.called}`).text(current.finished)

        return this
    }

    isAdmin() {
		return this.getRole() == "admin";
    }
    
	getRole() {
		return this.role;
	}

	setRole(role = "admin") {
        this.role = role;
        
        return this
	}

    setCurrent(id = 0,
        pending = 0,
        finished = 0,
        num = 1){
        this.current.id = id ? id : 0;
        this.current.pending = pending ? pending : 0;
        this.current.finished = finished ? finished : 0;
        this.current.num = num ? num : 0;

        return this
    }

    getNext(){
        return this.current.num + 1
    }

    setAnnouncer(ann){
        this.announcer = ann
        return this
    }

    getAnnouncer(){
        return this.announcer
    }

    setKodeLoketInt(kodeLoket){
        return this.setKodeLoket(parseInt(kodeLoket))
    }

    setKodeLoket(kodeLoket){
        this.kodeLoket = kodeLoket
        return this
    }

    getKodeLoket(){
        return this.kodeLoket
    }

    getAutoAnnounce() {
		return this.autoAnnounce;
	}

	setAutoAnnounce(autoAnnounce) {
        this.autoAnnounce = autoAnnounce;
        
        return this
    }
    
    getAutoChange() {
		return this.autoChange;
	}

	setAutoChange(autoChange) {
        this.autoChange = autoChange;
        
        return this
	}

    announce(num=1){
        if(this.isAdmin()){
            num = parseInt(num)
            this.getAnnouncer().callLoket(num)
        }
    }

    announceCurrent(){
        this.announce(this.current.num)
    }

    announceNext(){
        this.announce(this.getNext())
    }

    take(){
        this.callbacks.take(this)
    }

    print(num=1){
        num = parseInt(num)
        this.callbacks.print(this)
    }

    retry(){
        console.log("annc::"+this.id+"retry")
        if(this.getAutoAnnounce()){
            this.announceCurrent()
        }
        this.callbacks.retry(this)
        //
    }
    
    previous(){
        //todo : ajax add
        //local
        this.current.num--
        if(this.getAutoAnnounce()){
            this.announceCurrent()
        }
        // this.current.finished++
        this.callbacks.previous(this)
    }

    changeCurrent(type = ""){
        switch(type){
            case "next":
                console.log(this.current)
                this.current.num++
                this.current.pending--
                this.current.finished++
                console.log(this.current)
            break;
        }
        return this
    }

    async next(){
        console.log("annc::"+this.id+"next")
        //todo : ajax add
        //local
        
        await this.callbacks.next(this)

        if(this.getAutoChange()){
            this.changeCurrent("next")
        }
        if(this.getAutoAnnounce()){
            // await this.announceCurrent()
            await this.announceNext()
            this.callbacksAfterAnnounce.next(this)
        }
        
    }

    undoNext(){
        this.setAutoAnnounce(false)
        this.addPending()
        this.previous()
    }

    addPending(){
        this.current.pending++
        this.current.finished--

        return this
    }
    
    refresh(){
        //todo : ajax refresh
        console.log("refresh" + this.name)
        this.callbacks.previous(this)
    }

    setCallbacks(args = null){
        var noth = function(arg){
        }
        var callbacks = args ? args : {
            next: noth,
            previous: noth,
            announce: noth,
            refresh: noth,
        };

        if(args.next){
            callbacks.next = args.next
        }

        if(args.previous){
            callbacks.previous = args.previous
        }

        if(args.announce){
            callbacks.announce = args.announce
        }

        if(args.refresh){
            callbacks.refresh = args.refresh
        }

        if(args.retry){
            callbacks.retry = args.retry
        }

        this.callbacks = callbacks;

        return this
    }
    
    setCallbacksAfterAnnounce(args = null){
        var noth = function(arg){
        }
        var callbacks = args ? args : {
            next: noth,
            previous: noth,
            announce: noth,
            refresh: noth,
        };

        if(args.next){
            callbacks.next = args.next
        }

        if(args.previous){
            callbacks.previous = args.previous
        }

        if(args.announce){
            callbacks.announce = args.announce
        }

        if(args.refresh){
            callbacks.refresh = args.refresh
        }

        if(args.retry){
            callbacks.retry = args.retry
        }

        this.callbacksAfterAnnounce = callbacks;

        return this
    }
}

/*
sample

// instances
var queue = new Queue()
queue.setCurrent(0, 0, 12)
// announcer.callLoket(1)

var queues = [
    new Queue(1,"n1","desc1").setCurrent(0, 0, 0),
    new Queue(2,"n2","desc2").setCurrent(0, 0, 11),
    new Queue(3,"n3","desc3").setCurrent(0, 0, 20),
]

*/
