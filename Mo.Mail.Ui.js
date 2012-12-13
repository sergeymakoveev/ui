(function($) {

    Mo.Mail.Ui={};

    /**
     * @extends Mo.Mail.Obj.Simple
     * @class
     * @constructor
     * @param {Object} Parent
     * @returns {Mo.Mail.Ui.Simple}
     */
    Mo.Mail.Ui.Simple = function(Parent){

        Mo.Mail.Obj.Simple.apply(this, arguments);

        this.tmpl = this.tmpl || '';
        this.el   = this.el.size() ? this.el:
                                     $(this.tmpl);

        var This=this, Super={};

        // Interface
        /**
         * @description
         * .get_()    - отдает элемент самой панели
         * .get_('*') - отдает все элементы панели по-отдельности
         * .get_('name1', 'name2', ['name3', 'name4', ...], ...) - отдает указанные элементы
         * @param names
         * @returns {Mo.Mail.Ui.Simple}
         */
        This.get_ = function(names){
            var args = $.toPlainArray([].slice.call(arguments)
                                        .filter(function(arg){ return arg; })),
                buttons = args.length && args.join('')!='*'?
                                args.map(function(name){ return This.els[name]; })
                                    .filter(function(el){ return el; }):
                          args.length && args.join('')=='*'?
                                This.els.$buttons:
                                This.el_();

            return $(buttons);
        };
        /**
         * @description
         * .disable_()    - делает неактивной саму панель, сохраняя состояния элементов панели
         * .disable_('*') - деактивация всех элементов панели по-отдельности
         * .disable_('name1', 'name2', ['name3', 'name4', ...], ...) - деактивация указанных элементов
         * @param names
         * @returns {Mo.Mail.Ui.Simple}
         */
        This.disable_ = function(names){
            This.get_.apply(This, arguments)
                .addClass('disabled');
            return This;
        };
        /**
         * @description
         * .enable_()    - делает активной саму панель, сохраняя состояния элементов панели
         * .enable_('*') - активация всех элементов панели по-отдельности
         * .enable_('name1', 'name2', ['name3', 'name4', ...], ...) - активация указанных элементов
         * @param names
         * @returns {Mo.Mail.Ui.Simple}
         */
        This.enable_ = function(names){
            This.get_.apply(This, arguments)
                .removeClass('disabled');
            return This;
        };
    };

    /**
     * @extends Mo.Mail.Ui.Simple
     * @class
     * @constructor
     * @param {Object} Parent
     * @returns {Mo.Mail.Ui.El}
     */
    Mo.Mail.Ui.El = function(Parent){

        Mo.Mail.Ui.Simple.apply(this, arguments);

        var This=this, Super={};

        this._init = function(args){
            This.els.$buttons =
                This.el.find('[name]')
                       .each(function(i, el){
                            This.els[$(el).attr('name')]=el;
                        });
        };

        this._init.apply(this, [].slice.call(arguments).slice(1));

    };

    /**
     * @extends Mo.Mail.Ui.Simple
     * @class
     * @constructor
     * @param {Object} Parent
     * @returns {Mo.Mail.Ui.Toolbar}
     */
    Mo.Mail.Ui.Toolbar = function(Parent){

        Mo.Mail.Ui.Simple.apply(this, arguments);

        var This=this, Super={};

        this._init = function(args){
            This.els.$buttons =
                This.el.find('[name]')
                       .filter(function(){
                           return !$(this).parentsUntil(This.el, '[name]')
                                          .size();
                        })
                       .each(function(i, el){
                            This.els[$(el).attr('name')]=el;
                        });
        };

        this._init.apply(this, [].slice.call(arguments).slice(1));

    };

    /**
     * @extends Mo.Mail.Ui.Simple
     * @class
     * @constructor
     * @param {Object} Parent
     * @returns {Mo.Mail.Ui.Combo}
     */
    Mo.Mail.Ui.Combo = function(Parent){

        Mo.Mail.Ui.El.apply(this, arguments);

        var This=this;

        this._init = function(args){
            This.get_('menu')
                .mouseup(function(){this.blur();});
            This.get_('arrow')
                .mousedown(function(e){ if($(e.target).is(':focus'))
                                           window.setTimeout(function(){ e.target.blur(); }, 0); });
        };

        this._init.apply(this, [].slice.call(arguments).slice(1));

    };

    /**
     * @extends Mo.Mail.Ui.Combo
     * @class
     * @constructor
     * @param {Object} Parent
     * @returns {Mo.Mail.Ui.ComboBox}
     */
    Mo.Mail.Ui.ComboCheckBox = function(Parent){

        Mo.Mail.Ui.Combo.apply(this, arguments);

        var This=this, Super={};

        this._init = function(args){
            This.get_('button')
                .attr({checked:false})
                .click(args.button);
            This.get_('menu')
                .append( $().add( Object.keys(args.menu||{})
                                        .map(function(name){
                                                return $('<span/>').text(name)
                                                                   .click(args.menu[name])
                                                                   .get(0);  }) ));
        };

        this._init.apply(this, [].slice.call(arguments).slice(1));

    };

    /**
     * @extends Mo.Mail.Ui.Simple
     * @class
     * @constructor
     * @param {Object} Parent
     * @returns {Mo.Mail.Ui.ComboBox}
     */
    Mo.Mail.Ui.ComboBox = function(Parent){

        this.tmpl = '<div class="momail ui combobox button text" name="combobox">\
                         <div name="button"></div>\
                         <a name="arrow" tabindex="1"></a>\
                         <a class="wrapper" tabindex="1"><span name="menu"></span></a>\
                     </div>';

        Mo.Mail.Ui.Combo.apply(this, arguments);

        var This=this;

        this._init = function(args){
            var selected = This.val_()||
                           This.val_(Object.keys(args.menu||{})
                                           .shift())
                               .val_();
            This.get_('button')
                .click(function(){ args.menu[$(this).text()](); });
            This.get_('menu')
                .append( $().add( Object.keys(args.menu||{})
                                        .map(function(name){
                                                return $('<span/>').text(name)
                                                                   .toggleClass('selected', name==selected)
                                                                   .click(function(){ This.get_('button')
                                                                                          .text(name);
                                                                                      $(this).addClass('selected')
                                                                                             .siblings()
                                                                                                 .removeClass('selected');
                                                                                      args.menu[name](); })
                                                                   .get(0);  }) ));
        };

        // Interface
        this.val_ = function(val){
            val = arguments.length ? This.get_('button').text(val):
                                     This.get_('button').text();
            return arguments.length ? This : val;
        };

        this._init.apply(this, [].slice.call(arguments).slice(1));

    };

    Mo.Mail.Ui.DropDown = function(Parent){};
    Mo.Mail.Ui.ComboButton = function(Parent){};

})(jQuery);