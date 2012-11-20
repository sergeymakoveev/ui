(function($) {
    var This = this;
    /**
     * @member $
     * @param {Any} o
     * @param {Any} test
     * @returns {Boolean}
     */
    this.itIs = function(o, test){
        return arguments.length > 1?
            Object.prototype.toString.call(test) == Object.prototype.toString.call(o):
            Object.prototype.toString.call(Obj)  == Object.prototype.toString.call(o);
    };
    /**
     * @returns {Boolean}
     */
    this.itIsFile = function(o){
        return Object.prototype.toString.call(o) == File.toString();
    };
    /**
     * @returns {Boolean}
     */
    this.itIsFunction = function(o){
        return This.itIs.apply(This, [function(){}].concat([].slice.call(arguments)));
    };
    /**
     * @returns {Boolean}
     */
    this.itIsUndefined = function(o){
        return This.itIs.apply(This, [undefined].concat([].slice.call(arguments)));
    };
    /**
     * @returns {Boolean}
     */
    this.itIsNull = function(o){
        return This.itIs.apply(This, [null].concat([].slice.call(arguments)));
    };
    /**
     * @returns {Boolean}
     */
    this.itIsBoolean = function(o){
        return This.itIs.apply(This, [true].concat([].slice.call(arguments)));
    };
    /**
     * @returns {Boolean}
     */
    this.itIsString = function(o){
        return This.itIs.apply(This, [""].concat([].slice.call(arguments)));
    };
    /**
     * @returns {Boolean}
     */
    this.itIsObject = function(o){
        return This.itIs.apply(This, [{}].concat([].slice.call(arguments)));
    };
    /**
     * @param {Object} obj
     * @returns {Boolean}
     */
    this.itIsRegExp = function(o){
        return This.itIs.apply(This, [/./].concat([].slice.call(arguments)));
     };
     /**
      * @param {Object} obj
      * @returns {Boolean}
      */
     this.itIsArray = function(o){
         //return Array.isArray(o||Obj);
         return This.itIs.apply(This, [[]].concat([].slice.call(arguments)));
     };

    /**
     * @member $
     * @param {Any}
     * @returns {Any[]}
     */
    $.toPlainArray = function(){
        function reduce(){
            var a = [].concat.apply([],arguments);
            return a.some(function(v){return Array.isArray(v);})?
                    this.apply(this, a):a;
        };
        return reduce.apply(reduce, arguments);
    };
    /**
     * @member $
     * @param {Object} obj
     * @param {Object} filter
     * @returns {Object}
     */
    $.objFilter = function(obj, filter){
        if(filter.keys)
            for(var key in obj)
                if(!filter.keys.test(key))
                    delete(obj[key]);
        if(filter.values)
            for(var key in obj)
                if(!filter.values.test(obj[key]))
                    delete(obj[key]);
        return obj;
    };
    /**
     * @member $
     * @param {Object} obj1
     * @param {Object} obj2
     * @returns {Boolean}
     */
    this.objCompare = function(obj1, obj2){
        return $.obj2Path(obj1) == $.obj2Path(obj2);
    };
    /**
     * @member $
     * @param {Object} args
     * @returns {String}
     */
    this.obj2Path = function(args){
        var url=[];
        for(var i in args)
            if(args[i])
                url.push(decodeURIComponent(i),decodeURIComponent(args[i]));
            else
                break;
        return '/'+url.join('/');
    };
    /**
     * @member $
     * @param {String} key
     * @param {Object} obj
     * @returns {Boolean}
     */
    $.hasKey = function(key, obj){
            return $.isPlainObject(obj)&&(
                       ~Object.keys(obj).indexOf(key) ||
                       ~Object.keys(obj).indexOf(''+key)
                   );
        };
    /**
     * @member $
     * @param {String} value
     * @param {Array} arr
     * @returns {Boolean}
     */
    $.hasValue = function(value, arr){
            return $.isArray(arr)&&(
                       arr.indexOf(value)!=-1 ||
                       arr.indexOf(''+value)!=-1
                   );
        };
    /**
     * @member $
     * @param text
     * @returns {String}
     */
    $.escape = function(text){
        return $('<div>').text(text).html();
    };
    $.ui.keyCode.F2 = 113;

    $.fn.zIndexMax = function(){
        return $.makeArray(this.parents())
                .map(function(el){
                        var z = $(el).css('z-index');
                        return z=='auto'?0:z;
                    })
                .sort(function(a,b){return a-b;})
                .pop();
    };
    $.fn.getContentDocument = function(){
        var node = this.get(0);
        return $( node.contentDocument||
                  (node.contentWindow && node.contentWindow.document)
                  //||node.document||this.context
                );
    };
    $.fn.htmlLinkify = function(){
        this.each(function(){
            [].slice.call(this.childNodes)
              .forEach(function(n){
                    var $n=$(n);
                    if(n.nodeType == 3 && n.nodeValue)
                        $n.after(
                            n.nodeValue
                             .replace(/&/g, '&amp;')
                             .replace(/</g, '&lt;')
                             .replace(/>/g, '&gt;')
                             .replace(/(^|\s|&lt;|'|")(www\..+?\..+?)(\s|&gt;|$)/g,
                                      '$1<a href="http://$2">$2</a>$3')
                             .replace(/(^|\s|&lt;|'|")(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|$)/g,
                                      '$1<a href="$2">$2</a>$5')
                             .replace(/(^|\s|&lt;|'|")([A-Z0-9._%+-]+@([A-Z0-9._%+-]+\.)+[a-z]{2,3})/gi, '$1<a href="mailto:$2">$2</a>')
                        ).remove();
                    else if (n.nodeType == 1  &&  !$n.is('a[href],button,textarea'))
                        $n.htmlLinkify();
             });
        });
        return this;
    };
    $.fn.externalSources = function(allow, onload){
        if(allow)
            this.find('img[data-src]')
                .removeClass('momail-external')
                .addClass('momail-waited')
                .load(function(){
                        $(this).removeClass('momail-waited');
                        onload && onload();
                    })
                .each(function(){
                    var $this = $(this);
                    $this.attr('src', $this.data('src'));
                 });
        else
            this.find('img[src^="http://"]')
                .addClass('momail-external')
                .each(function(){
                    var $this = $(this);
                    $this.attr({
                        src:'/++mo_mail++/styles/images/dot.gif',
                        'data-src':$this.attr('src')
                    });
                 });
        return this;
    };
    $.fn.htmlSanitize = function(args){
        args = args || {};
        this.find('meta, script, title').remove().end()
            .find('iframe').attr({src:''}).end()
            .htmlLinkify()
            // СѓР±РёСЂР°РµРј РІСЃРµ Р°С‚СЂРёР±СѓС‚С‹ 'on*'
            .find('*')
                .each(function(i, el){ [].slice.call(el.attributes)
                                         .map(function(a){ return a.name; })
                                         .filter(function(a){ return /^on/i.test(a); })
                                         .forEach(function(a){ $(el).removeAttr(a); }); })
                .end()
            //СѓР±РёСЂР°РµРј Сѓ СЃСЃС‹Р»РѕРє РІСЃРµ Р°С‚СЂРёР±СѓС‚С‹ 'href', РєРѕС‚РѕСЂС‹Рµ СѓРєР°Р·С‹РІР°СЋС‚ РЅРµ РЅР° 'http:, https:, mailto:'
            .find('a[href]:not([href^="http\:"]):not([href^="https\:"]):not([href^="mailto\:"])').removeAttr('href').end()
            .find('a[href]').attr({target:'_blank'}).end()
            .find('img[src^="/"]').addClass('momail-waited').end()
            .filter(function(){return !args.externalsources;})
                .externalSources()
                .end();
        return this;
    };


}).call(jQuery, jQuery);