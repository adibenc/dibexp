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
    useStartZero = false
    debug = false

    getBaseSpelling() {
        if(this.useStartZero){
            return ["kosong", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"]
        }else{
            return ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"]
        }
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
        } else if (value < 1e6) {
            temp = this.spell(value/1000)  + " ribu"  
            + this.spell(value % 1000);
        } else if (value < 1e9) {
            temp = this.spell(value/1000000)  + " juta"  
            + this.spell(value % 1000000);
        } else if (value < 1e12) {
            // fmod(value, 1000000000)
            temp = this.spell(value/ 1e9)  + " milyar"  
                + this.spell( value % 1e9 );
        } else if (value < 1e15) {
            temp = this.spell(value/1e12)  + " trilyun"  
                + this.spell( value % 1e12 );
        }
        if(this.debug){
            console.log([value, temp])
        }
        return temp;
    }
}

// audio player
class Player{
    idx = 0
    wait = 1000
    playlist = []

    setPlaylist(playlistL){
        this.playlist = playlistL
        
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

    plays(wait = 1000){
        var idx = 0
        // var wait = 1000

        var ctx = this;
        var plocal = this.playlist
        var timeout = setTimeout(function(){
            ctx.idx++;
            try{
                plocal[ctx.idx].play()
                wait = plocal[ctx.idx].duration == NaN ? 1000 : plocal[ctx.idx].duration * 1000;
                ctx.plays(wait);
            }catch(e){
                console.log("err play::"+e)
            }
        }, wait);
        // }, playlist[idx].duration);
        
        if(plocal.length == idx){
            clearTimeout(timeout);
            return ctx;
        }
    }
}

// announcer, use player & numberspeller class
class Announcer{
    template = {
        keloket:[
            'no-antrian.wav',
            'silahkan-masuk-ke.wav',
            'loket-kasir.wav'
        ],
    }

    sentence = []

    assemble(template = "", arg = {}){
        var ctx = this
        switch(template){
            case "keloket":
                var tl = this.template["keloket"]
                console.log(tl)
                console.log(tl[0])
                this.sentence.push("")
                this.sentence.push(tl[0])
                
                arg.angka.forEach(function(e,i){
                    ctx.sentence.push(e)
                })

                this.sentence.push(tl[1])
                this.sentence.push(tl[2])
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

    callLoket(num = 0){
        this.resetSentence()
        var nSpeller = new NumberSpeller()
        
        var st1 = nSpeller.spell(num)
        
        var audios = this.assemble("keloket", {
            angka: nSpeller.files
        })
        console.log(this.sentence)
        this.makePlaylist(this.sentence).call()
    }

    call(){

        var player = new Player()
        player.setPlaylist(this.playlist).plays()
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
    autoAnnounce = false

    callbacks = {
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

    setAnnouncer(ann){
        this.announcer = ann
        return this
    }

    getAnnouncer(){
        return this.announcer
    }

    getAutoAnnounce() {
		return this.autoAnnounce;
	}

	setAutoAnnounce(autoAnnounce) {
        this.autoAnnounce = autoAnnounce;
        
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

    take(){
        this.callbacks.take(this)
    }

    print(num=1){
        num = parseInt(num)
        this.callbacks.print(this)
    }

    retry(){
        console.log("annc::"+this.id+"retry")
        this.announceCurrent()
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

    next(){
        console.log("annc::"+this.id+"next")
        //todo : ajax add
        //local
        this.current.num++
        this.current.pending--
        this.current.finished++
        this.callbacks.next(this)
        if(this.getAutoAnnounce()){
            this.announceCurrent()
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