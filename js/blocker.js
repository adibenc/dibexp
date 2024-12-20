var Blocker = {
    // block element
    blockEl(el, conf = null) {
        conf = conf ? conf : Blocker.configs("b1");
        $(el).block(Blocker.configs("b1"));
        $(el).css({
            overflow: 'hidden',
            height: '100%'
        });
    },
    unblockEl(el) {
        $(el).unblock();
        $(el).css({
            overflow: 'auto',
            height: 'auto'
        });
    },
    configs(type = null, args = {}) {
        var ret = {};
        switch (type) {
            case "basic":
                ret = {
                    css: {
                        border: 'none',
                        padding: '15px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        opacity: .8,
                        color: '#fff'
                    },
                    message: "Wait..",
                }
                break;
            case "b1":
                ret = Blocker.configs("basic")
                ret.message = "Memproses.."
                break;
        }
        return ret
    },
    unblock() {
        // setTimeout($.unblockUI, 2000);
        $.unblockUI()
    },
    preset(type) {
        switch (type) {
            case "block-filter":
                Blocker.blockEl("#filterPane")
                break;
            case "unblock-filter":
                Blocker.unblockEl("#filterPane")
                break;
        }
    }
}

var locker = {
    lock(el) {
        $(el).prop('disabled', true);
    },
    unlock(el) {
        $(el).prop('disabled', false);
    },
}