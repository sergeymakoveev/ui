Mo = {Mail:{}};
$.ui={keyCode:{}};

$(function($){
    var toolbar = new Mo.Mail.Ui.Toolbar({},{el:document}),
        onclick = function(args){ alert(args); };
    new Mo.Mail.Ui.ComboCheckBox(toolbar, {
        el:toolbar.get_('combocheckbox'),
        button: function(){ onclick(this.checked?':not(*)':'*'); },
        menu:(function(menu){
                menu['All']                = function(){ onclick('*'); };
                menu['None']               = function(){ onclick(':not(*)'); };
                menu['Read']               = function(){ onclick('.meta:not(.unread)'); };
                menu['Unread']             = function(){ onclick('.meta.unread'); };
                menu['Has attachments']    = function(){ onclick('.meta.has_attachments'); };
                menu['Has no attachments'] = function(){ onclick('.meta:not(.has_attachments)'); };
                menu['Inverse']            = function(){ onclick(':not(:selected)'); };
                return menu; })({})
    });
    new Mo.Mail.Ui.ComboBox(toolbar, {
        el:toolbar.get_('combobox'),
        menu:(function(menu){
                menu['Mark as read']   = function(){ onclick({unread:false}); };
                menu['Mark as unread'] = function(){ onclick({unread:true}); };
                menu['Mark as spam']   = function(){ onclick({spam:true}); };
                menu['Mark as nospam'] = function(){ onclick({spam:false}); };
                return menu; })({})
    });
});
