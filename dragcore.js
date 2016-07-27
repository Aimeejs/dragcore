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
            this.fire('drop', [filterType(this.getFiles(e), this.config.get('type'))]);
        })
        // 兼容传统上传方式
        // => input[type="file"]
        !config.File || this.$.on('change', config.File, (e) => {
            this.fire('drop', [filterType(e.target.files, this.config.get('type'))]);
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
        var form = new FormData();
        files.forEach((file) => {
            form.append(file.name.replace('.', '_'), file)
        })
        return form;
    }

    /**
     * 发送到目标服务器，默认为POST请求
     * @param   {String}   url   远程URL
     * @param   {Array}    files 文件队列
     * @param   {Function} fn    成功回调
     * @param   {Function} func  失败回调
     */
    send(url, files, fn, func) {
        if(files.length){
            $.ajax({
                url: url,
                type: 'POST',
                contentType: false,
                processData: false,
                data: this.getFormData(files),
                success: fn,
                error: func
            })
        }
        else{
            console.warn('files.length is 0')
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
