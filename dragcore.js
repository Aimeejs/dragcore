import Config from 'config';

/**
 * 检查文件类型是否正确
 * @param   {Array}   files 文件数组
 * @param   {String}  type  限制文件类型
 * @return  {Array}         符合条件的文件数组
 */
function filterType(files, type) {
    var res = [];
    type = type || '';
    Array.from(files).forEach((file) => {
        if(file.type.match(type)){
            res.push(file)
        }
        else{
            console.warn(file.name, 'type error')
        }
    })
    return res;
}

class Dragcore {

    constructor(options) {
        let defaults = {
            type: null,
            File: 'input[type="file"]',
            drop: () => {},
            dragover: () => {},
            dragenter: () => {},
            dragleave: () => {}
        }
        if(!$.isPlainObject(options)){
            let selector = options;
            options = {};
            options.selector = selector;
        }
        this.$ = $(options.selector || window);
        this.config = new Config;
        this.config.init(defaults);
        this.config.merge(options);
        this.supportEvents = 'drop dragenter dragover dragleave change'.split(' ');
        this.bind();
    }

    bind() {
        var config = this.config.get();

        this.$.on('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            config.dragenter(e);
        })
        this.$.on('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            config.dragleave(e);
        })
        this.$.on('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            config.dragover(e);
        })
        this.$.on('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.fire('drop', [e, filterType(this.getFiles(e), this.config.get('type'))]);
        })
        // 兼容传统上传方式
        // => input[type="file"]
        !config.File || this.$.on('change', config.File, (e) => {
            this.fire('drop', [e, filterType(e.target.files, this.config.get('type'))]);
        })
    }

    /**
     * 获取文件列表
     * @param   {Object}  e drop.event对象
     * @return  {Array}     files
     */
    getFiles(e) {
        return e.dataTransfer ?
            e.dataTransfer.files :
            e.originalEvent && e.originalEvent.dataTransfer ?
                e.originalEvent.dataTransfer.files : [];
    }

    /**
     * 构建Blob协议地址
     * @param   {Object}  file File实例对象
     * @return  {String}       Blob协议URL
     */
    getURL(file) {
        if(window.URL){
            return window.URL.createObjectURL(file)
        }
        if(window.webkitURL){
            return window.webkitURL.createObjectURL(file)
        }
        return null;
    }

    /**
     * 构建FormData实例对象
     * @param   {Array}  files  文件队列
     * @return  {Object}        FormData实例对象
     */
    getFormData(files) {
        var name = [];
        var form = new FormData();
        files.forEach((file) => {
            name.push(file.name.replace('.', '_'));
            form.append(name[name.length-1], file);
        });
        form.append('filename', name.join(','));
        return form;
    }

    /**
     * 发送到目标服务器，默认为POST请求
     * @param  {Object}  options  $.ajax(options)
     */
    send(options) {
        if(!$.isPlainObject(options)){
            return console.error('options must be a plain object')
        }
        if(!(options.data instanceof FormData)){
            options.data = this.getFormData(options.data)
        }
        options.xhr = options.xhr || getXhr;
        options.type = options.type || 'POST';
        options.contentType = options.contentType || false;
        options.processData = options.processData || false;

        $.ajax(options);

        function progress(e) {
            let done = e.loaded || e.position
            let total = e.total || e.totalSize;
            let prog = Math.round(done/total*100) + '%';
            !$.isFunction(options.progress) || options.progress(e, prog);
        }

        function getXhr() {
            let xhr = jQuery.ajaxSettings.xhr();
            xhr.upload.addEventListener('progress', progress, false);
            if(options.upload){
                options.progress = options.progress || options.upload.progress;
                !$.isFunction(options.load) || xhr.upload.addEventListener('load', options.load, false);
                !$.isFunction(options.abort) || xhr.upload.addEventListener('abort', options.abort, false);
                !$.isFunction(options.error) || xhr.upload.addEventListener('error', options.error, false);
                !$.isFunction(options.loadstart) || xhr.upload.addEventListener('loadstart', options.loadstart, false);
                !$.isFunction(options.loadEnd) || xhr.upload.addEventListener('loadend', options.loadEnd, false);
            }
            return xhr;
        }
    }

    on(type, fn) {
        !this.supportEvents.includes(type) || this.config.set(type, fn)
    }

    off(type) {
        !this.supportEvents.includes(type) || this.config.set(type, () => {})
    }

    fire(type, args) {
        !this.supportEvents.includes(type) || this.config.get(type).apply(this, args)
    }

    trigger(type, args) {
        this.fire.apply(this, arguments)
    }
}

export default Dragcore;
