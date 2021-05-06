(function(saber) {
    "use strict";

    if (typeof saber.main === 'function')
        saber.main();
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
    proxyIsSet: function() {
        return this.proxy !== undefined
            && this.proxy !== null
            && this.proxy.domain !== undefined
            && this.proxy.url !== undefined;
    },
    myIntervalIsSet: function() {
        return this.myInterval !== null && this.myInterval !== undefined;
    },
    fixLink: function(elmt) {
        if (!this.proxyIsSet())
            return;

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
        if (!this.proxyIsSet())
            return;

        Array
        .from(document.getElementsByTagName('a'))
        .forEach(function(el) {
            if (new RegExp(this.proxy.domain).test(el.href))
                this.fixLink(el);
        }.bind(this));
    },
    run: function() {
        this.runs++;

        if (this.isTimeToClearMyInterval())
            this.clearMyInterval();

        this.loopThruAnchors();
    },
    setProxy: function() {
        if (this.proxyIsSet())
            return;

        this.proxies.forEach(function(p) {
            if (new RegExp(p.url).test(window.location))
                this.proxy = p;
        }.bind(this));
    },
    main: function() {
        this.setProxy();

        /*
         * If the proxy is not set, it must be because the page's url is not
         * listed in the **proxies** property of this object. If so, none of 
         * the links need processing and the extension must not be executed.
         */
        if (!this.proxyIsSet())
            return;

        this.myInterval = setInterval(this.run.bind(this), 500);
    }
});
