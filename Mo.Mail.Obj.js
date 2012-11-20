(function($) {
    /**
     * @namespace Mo.Mail.Obj
     */
    Mo.Mail.Obj={};



    /**
     * @constructor
     * @param {Object} Parent
     * @param {Object} Args
     * @returns {Mo.Mail.Obj.Elementary}
     */
    Mo.Mail.Obj.Elementary = function(Parent, Args){

        this.lnks=Parent.lnks||{};

    };

    /**
     * @constructor
     * @extends Mo.Mail.Obj.Elementary
     * @param {Object} Parent
     * @param {Object} Args
     * @returns {Mo.Mail.Obj.Simple}
     */
    Mo.Mail.Obj.Simple = function(Parent, Args){

        var This=this;

        Mo.Mail.Obj.Elementary.apply(this, arguments);

        this.els={}, this.cmps={}, this.xhrs={};

        Args = Args || {};
        /**
         * @field
         * @type {jQuery}
         */
        this.el = $(Args.el);
        this.opts = Args.opts||{};

        /**
         * @description Interface method
         * @function
         * @param {Object} args
         * @returns {Mo.Mail.Obj.Simple}
         */
        this.opts_ = function(args){
            $.extend(This.opts, args);
            return This;
        };
        /**
         * @description Interface method
         * @param {String} key
         */
        this.opt_ = function(key){
            return This.opts[key];
        };
        /**
         * @description Interface methods
         * @returns {jQuery}
         */
        this.el_ = function(){return This.el;};
        /**
         * @description Interface method
         * @returns {String}
         */
        this.id_ = function(){
            return ''+(This.opts.id||'');
        };
        this.del_ = function(){
            This.el.remove();
            return This;
        };
        this.empty_ = function(){
            This.el.empty();
            return This;
        };
        this.hide_ = function(){
            This.el.hide(700);
            return This;
        };
        this.show_ = function(){
            This.el.show(700);
            return This;
        };
        this.isExists_ = function(){
            return !!$(document).has(This.el).get().length;
        };

    };



    /**
     * @extends Mo.Mail.Obj.Simple
     * @param Parent {Mo.Mail.Obj.Store}
     * @returns {Mo.Mail.Obj.Item}
     */
    Mo.Mail.Obj.Item = function(Parent){

        var This=this, Super={};

        Mo.Mail.Obj.Simple.apply(this, arguments);

        /**
         * @description Interface method
         * @returns Boolean
         */
        this.isSelected_ = function(){
            return This.el.hasClass('selected');
        };
        this.selected_ = this.isSelected_;

        /**
         * @description Interface method
         * @returns {Mo.Mail.Obj.Item}
         */
        this.select_ = function(){
            This.el.addClass('selected')
                   .siblings('.selected').removeClass('selected');
            return This;
        };

        /**
         * @description Interface method
         * @returns {Mo.Mail.Obj.Item}
         */
        this.deselect_ = function(){
            This.el.removeClass('selected');
            return This;
        };

        Super.hide_ = this.hide_;
        /**
         * @description Interface method
         * @returns {Mo.Mail.Obj.Item}
         */
        this.hide_ = function(){
            This.el.addClass('hidden_');
            Super.hide_();
            return This;
        };

        Super.show_ = this.show_;
        /**
         * @description Interface method
         * @returns {Mo.Mail.Obj.Item}
         */
        this.show_ = function(){
            This.el.removeClass('hidden_');
            Super.show_();
            return This;
        };

        /**
         * @description Interface method
         * @returns Boolean
         */
        this.isHidden_= function(){
            return !This.el_().is(':visible')||
                    This.el.hasClass('hidden_');
        };
        this.hidden_= this.isHidden_;

        /**
         * @description Interface method
         * @returns {Mo.Mail.Obj.Item}
         */
        this.append_= function(){
            Parent.push_(This);
            return This;
        };
    };




    /**
     * @extends Mo.Mail.Obj.Simple
     * @returns {Mo.Mail.Obj.Store}
     */
    Mo.Mail.Obj.Store = function(Parent){

        var This=this, Super={};

        Mo.Mail.Obj.Simple.apply(this, arguments);

        /**
         * @type Mo.Mail.Obj.Item[]
         */
        this.store = [];

        /**
         * @param {Mo.Mail.Obj.Item} item
         * @returns {Mo.Mail.Obj.Store}
         */
        this.push_ = function(item){
            if(This.get_(This.getID_(item)))
                This.del_(This.getID_(item));
            This.store.push(item);
            if(!This.el_().has(item.el_()).size())
                This.el_().append(item.el_());
            return This;
        };

        this.add_ = function(item, sort){
            if(This.get_(This.getID_(item)))
                This.del_(This.getID_(item));
            This.store = This.getStore_()
                             .concat(item)
                             .sort(This.opt_('sort')||sort||function(){});
            var sibling;
            if(!This.el_().has(item.el_()).size())
                if(sibling = This.getNext_(item))
                    item.el_()
                        .insertBefore(sibling.el_());
                else if(sibling = This.getPrev_(item))
                    item.el_()
                        .insertAfter(sibling.el_());
                else
                    item.el_()
                        .appendTo(This.el_());
        };

        /**
         * @param {Mo.Mail.Obj.Item} item
         * @returns {Mo.Mail.Obj.Store}
         */
        this.unshift_ = function(item){
            if(This.get_(This.getID_(item)))
                This.del_(This.getID_(item));
            This.store.unshift(item);
            if(!This.el_().has(item.el_()).size())
                This.el_().prepend(item.el_());
            return This;
        };

        /**
         * @returns {Mo.Mail.Obj.Item}
         */
        this.pop_ = function(){
            return This.store.pop();
        };

        /**
         * @returns {Mo.Mail.Obj.Item}
         */
        this.shift_ = function(){
            return This.store.shift();
        };

        Super.empty_ = this.empty_;
        /**
         * @returns {Mo.Mail.Obj.Store}
         */
        this.empty_ = function(){
            //This.each_(function(item){
            //    item.del_();
            //});
            Super.empty_();
            This.empty_store_();
            return This;
        };

        /**
         * @returns {Mo.Mail.Obj.Store}
         */
        this.empty_store_ = function(){
            This.store.splice(0, This.store.length);
            return This;
        };

        /**
         * @param {String[]} ids
         * @returns {Mo.Mail.Obj.Store}
         */
        this.del_ = function(ids){
            ($.isArray(ids)?ids:[ids])
                .forEach(function(id){
                    /**
                     * @type Mo.Mail.Obj.Item
                     */
                    var item = This.get_(id);
                    if(item)
                        item.del_(),
                        //delete(This.store[This.getIndexByID(id)]),
                        This.store.splice(This.getIndex_(id),1);
                });
            return This;
        };

        /**
         * @param {String} id
         * @returns {Mo.Mail.Obj.Item}
         */
        this.get_ = function(id){
            if(This.store.indexOf(id)!=-1)
                return id;
            for(var i=0;i<This.store.length;i++)
                if(This.getID_(This.store[i]) == id)
                    return This.store[i];
        };

        this.getID_ = function(item){
            if(item)
                return item.id_();
        };

        /**
         * @returns {Number[]}
         */
        this.getIDs_ = function(){
            return This.map_(function(item){return This.getID_(item);});
        };

        /**
         * @param {String} id
         * @returns {Number}
         */
        this.getIndex_ = function(id){
            var i = This.store.indexOf(id);
            if(i !=-1 )
                return i;
            for(var i=0;i<This.store.length;i++)
                if(This.getID_(This.store[i]) == id)
                    return i;
        };

        /**
         * @returns {Mo.Mail.Obj.Item[]}
         */
        this.getStore_ = function(){
            // РґРµР»Р°РµРј РєРѕРїРёСЋ store С‡С‚РѕР±С‹ РёР·РјРµРЅРµРЅРёСЏ, РєРѕС‚РѕСЂС‹Рµ РґРµР»Р°СЋС‚СЃСЏ РІРЅСѓС‚СЂРё forEach РЅРµ РІР»РёСЏР»Рё РЅР° РїРѕСЃР»РµРґРѕРІР°С‚РµР»СЊРЅРѕСЃС‚СЊ СЌР»РµРјРµРЅС‚РѕРІ РІ С†РёРєР»Рµ
            return This.store.slice();
        };

        /**
         * @param {Function} f
         * @returns {Mo.Mail.Obj.Store}
         */
        this.each_ = function(f){
            This.getStore_().forEach(function(e, i){
                f(e, This.getID_(e), This);
            });
            return This;
        };

        /**
         * @param {Function} f
         * @returns {Mo.Mail.Obj.Item[]}
         */
        this.filter_ = function(f){
            return This.getStore_()
                       .filter(f);
        };

        /**
         * @param {Function} f
         * @returns {Mo.Mail.Obj.Item[]}
         */
        this.map_ = function(f){
            return This.getStore_()
                       .map(f);
        };

        this.has_ = function(id){
            return This.get_.apply(this, arguments)&&id;
        };

        /**
         * @returns {Mo.Mail.Obj.Item}
         */
        this.getFirst_ = function(){
            return This.getStore_()
                       .shift();
        };

        /**
         * @returns {String}
         */
        this.getFirstID_ = function(){
            return This.getID_(This.getFirst_.apply(this, arguments));
        };

        /**
         * @returns {Mo.Mail.Obj.Item}
         */
        this.getLast_ = function(){
            return This.getStore_()
                       .pop();
        };

        /**
         * @returns {String}
         */
        this.getLastID_ = function(){
            return This.getID_(This.getLast_.apply(this, arguments));
        };

        /**
         * @param {String} id
         * @returns {Mo.Mail.Obj.Item}
         */
        this.getNext_ = function(id){
            return This.getStore_()
                       .slice(This.getIndex_(id||This.selected_())+1)
                       .shift();
        };

        /**
         * @param {String} id
         * @returns {String}
         */
        this.getNextID_ = function(id){
            return This.getID_(This.getNext_.apply(this, arguments));
        };

        /**
         * @param {String} id
         * @returns {Mo.Mail.Obj.Item}
         */
        this.getPrev_ = function(id){
            return This.getStore_()
                       .slice(0, This.getIndex_(id||This.selected_()))
                       .pop();
        };

        /**
         * @param {String} id
         * @returns {String}
         */
        this.getPrevID_ = function(id){
            return This.getID_(This.getPrev_.apply(this, arguments));
        };

        /**
         * @returns {Mo.Mail.Obj.Item}
         */
        this.getSelected_ = function(){
            return This.filter_(
                    function(i){return i.selected_();}
                ).pop();
        };

        /**
         * @returns {String|undefined}
         */
        this.getSelectedID_ = function(){
            return This.getID_(This.getSelected_());
        };

        /**
         * @returns {Number}
         */
        this.len_ = function(){
            return This.store.length;
        };

        this.dump_ = function(){
            try{ console.log(This.store); } catch(ex){};
        };

        /**
         * @description Interface method
         * @param {Mo.Mail.Obj.Item} item
         * @param {Event} e
         * @returns {Mo.Mail.Obj.Store}
         */
        this.select_ = function(item, e){
            if(item = This.get_(item))
                item.select_(e);
            return This;
        };

        /**
         * @description Interface method
         * @param {Mo.Mail.Obj.Item} item
         * @returns {Mo.Mail.Obj.Store}
         */
        this.deselect_ = function(item){
            if( item = item ? This.get_(item) : This.getSelected_() )
                item.deselect_();
            return This;
        };

        /**
         * @description Interface method
         * @returns {String|undefined}
         */
        this.selected_ = this.getSelectedID_;

        /**
         * @description Interface method
         * @returns {Mo.Mail.Obj.Store}
         */
        this.focus_ = function(){
            This.el.addClass('selected');
            return This;
        };

        /**
         * @description Interface method
         * @returns {Mo.Mail.Obj.Store}
         */
        this.unfocus_ = function(){
            This.el.removeClass('selected');
            return This;
        };

        /**
         * @description Interface method
         * @returns Boolean
         */
        this.focused_ = function(){
            return This.el.hasClass('selected');
        };

    };

    /**
     * @constructor
     * @extends Mo.Mail.Obj.Store
     * @returns {Mo.Mail.Obj.StoreFiltered}
     */
    Mo.Mail.Obj.StoreFiltered = function(Parent){

        var This  = this,
            Super = {},
            Opts  = {filter:function(item){return !item.isHidden_();}};

        Mo.Mail.Obj.Store.apply(this, arguments);

        Super.getStore_ = this.getStore_;
        /**
         * @param {Boolean} filtered
         * @returns {Mo.Mail.Obj.Item[]}
         */
        this.getStore_ = function(filtered){
            var items = Super.getStore_();

            if(filtered)
                items = items.filter(Opts.filter);

            return items;
        };

        Super.get_ = this.get_;
        /**
         * @param {String} id
         * @returns {Mo.Mail.Obj.Item}
         */
        this.get_ = function(id, filtered){
            var items = [].concat(Super.get_(id)||[]);

            if(filtered)
                items = items.filter(Opts.filter);

            return items.shift();
        };

        /**
         * @param {Boolean} filtered
         * @returns {Mo.Mail.Obj.Item}
         */
        this.getFirst_ = function(filtered){
            return This.getStore_(filtered)
                       .shift();
        };

        /**
         * @param {Boolean} filtered
         * @returns {Mo.Mail.Obj.Item}
         */
        this.getLast_ = function(filtered){
            return This.getStore_(filtered)
                       .pop();
        };

        /**
         * @param {String} id
         * @param {Boolean} filtered
         * @returns {Mo.Mail.Obj.Item}
         */
        this.getNext_ = function(id, filtered){
            var items = This.getStore_()
                            .slice(This.getIndex_(id||This.selected_())+1);
            if(filtered)
                items = items.filter(Opts.filter);

            return items.shift();
        };

        /**
         * @param {String} id
         * @param {Boolean} filtered
         * @returns {Mo.Mail.Obj.Item}
         */
        this.getPrev_ = function(id, filtered){
            var items = This.getStore_()
                            .slice(0, This.getIndex_(id||This.selected_()));
            if(filtered)
                items = items.filter(Opts.filter);

            return items.pop();
        };

        /**
         * @param {Boolean} filtered
         * @returns {Number}
         */
        this.len_ = function(filtered){
            return This.getStore_(filtered).length;
        };
        /**
         * @returns {Mo.Mail.Obj.StoreFiltered}
         */
        this.hide_ = function(){
            $.toPlainArray.apply(This, arguments)
             .forEach(function(item){
                     if(item = This.get_(item))
                         item.hide_();
                 });
            return This;
        };
        /**
         * @returns {Mo.Mail.Obj.StoreFiltered}
         */
        this.show_ = function(){
            $.toPlainArray.apply(This, arguments)
             .forEach(function(item){
                     if(item = This.get_(item))
                         item.show_();
                 });
            return This;
        };

    };
})(jQuery);
