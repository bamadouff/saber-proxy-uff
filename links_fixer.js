(function(linksFixer) {
    "use strict";

    linksFixer.run();
})({
    proxies: [
        {
            domain: 'dl.acm.org',
            url: 'acm.proxy.uff.br'
        }
    ],
    proxy: null,
    myInterval: null,
    runs: 0,
    fixedLinks: 0,
    myIntervalIsSet: function() {
        return this.myInterval !== null && this.myInterval !== undefined;
    },
    fixLink: function(elmt) {
        this.fixedLinks++;
        elmt.href = elmt.href.replace(this.proxy.domain, this.proxy.url);
    },
    clearMyInterval: function() {
        clearInterval(this.myInterval);
        this.myInterval = null;
    },
    isTimeToClearMyInterval: function() {
        if (!this.myIntervalIsSet())
            return false;

        if (this.runs > 8)
            return true;

        return this.runs > 3 && this.fixedLinks > 0;
    },
    loopThruAnchors: function() {
        Array
        .from(document.getElementsByTagName('a'))
        .forEach(function(el) {
            if (new RegExp(this.proxy.domain).test(el.href))
                this.fixLink(el);
        }.bind(this));
    },
    main: function() {
        this.runs++;

        if (this.isTimeToClearMyInterval())
            this.clearMyInterval();

        this.loopThruAnchors();
    },
    setProxy: function() {
        this.proxies.forEach(function(p) {
            if (new RegExp(p.url).test(window.location))
                this.proxy = p;
        }.bind(this));
    },
    run: function() {
        this.setProxy();

        if (this.proxy === null || this.proxy === undefined)
            return;

        this.myInterval = setInterval(this.main.bind(this), 500);
    }
});
