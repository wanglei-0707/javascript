function Modal(opt){
    var setting = {
        controlBtn: 'control-btn',
        wrapper: 'modal-wrapper',
        panel: 'modal-panel',
        confirmBtn: 'modal-confirm-btn',
        cancelBtn: 'modal-cancel-btn',
        closeBtn: 'modal-close-btn'
    };
    if(opt){
        for(var key in opt){
            setting[key] = opt[key];
        }
    }
    this.controlBtn = document.getElementById(setting.controlBtn);
    this.modal = document.getElementsByClassName(setting.wrapper)[0];
    this.panel = document.getElementsByClassName(setting.panel)[0];
    this.confirmBtn = document.getElementsByClassName(setting.confirmBtn)[0];
    this.cancelBtn = document.getElementsByClassName(setting.cancelBtn)[0];
    this.closeBtn = document.getElementsByClassName(setting.closeBtn)[0];
    this.init();
}
Modal.prototype.open = function(){
    this.modal.style.display = 'block';
};
Modal.prototype.close = function(){
    this.modal.style.display = 'none';
};
Modal.prototype.init = function(){
    var self = this;
    wl.addEvent(this.controlBtn, 'click', function(){
        self.open();
    });
    wl.addEvent(this.modal, 'click', function(e){
        e = wl.getEvent(e);
        var target = wl.getTarget(e);
        if(target)
        self.close();
    });
    wl.addEvent(this.confirmBtn, 'click', function(e){
        self.close();
    });
    wl.addEvent(this.panel, 'click', function(e){
        e = wl.getEvent(e);
        wl.stopPropa(e);
    });
    wl.addEvent(this.closeBtn, 'click', function(e){
        self.close();
    });
    wl.addEvent(this.cancelBtn, 'click', function(e){
        self.close();
    })
};
