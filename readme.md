Dragcore
---

### Install
```sh
aimee i dragcore --save
```

### Example
```js
var Dragcore = require('dragcore');

```
```js
var drag = new Dragcore('.lincoapp-drag');
drag.config.set('type', 'image');
```
or
```js
var drag = new Dragcore({
    selector: '.lincoapp-drag',
    type: 'image'
});
```
```js
/**
 * Support Events
 * @drop
 * @dragover
 * @dragenter
 * @dragleave
 */
drag.on('drop', (e, files) => {
    files.forEach((file) => {
        $(document.body).append(`<img width="200" src="${drag.getURL(file)}">`)
    })

    // 上传文件 POST请求 FormData数据
    drag.send({
        url: '/url',
        data: files,
        error: (msg) => {
            console.log(msg)
        },
        success: (msg) => {
            console.log(msg)
        },
        // 上传进度
        progress: (e, prog) => {
            console.log(prog)
            if(prog === '100%'){
                console.log('upload done')
            }
        },
        // XHR.upload
        upload: {
            load: () => {},
            error: () => {},
            abort: () => {},
            loadend: () => {},
            loadstart: () => {},
            // 同上 progress 上传进度 二者选其一
            progress: (e, prog) => {
                console.log(prog)
                if(prog === '100%'){
                    console.log('upload done')
                }
            }
        }
    })
})
```

### Usage
```js
var drag = require('dragcore');
var drag = new Dragcore([@selector | @options]);

// 构建Blob协议URL，常用与预览
drag.getURL(file)
```

### Documents
* ``@selector`` ``type: String | Node | jQuery | Zepto`` 监听的元素  
* ``@options`` ``type: Object`` 配置项  
    * ``options.type`` ``type: String`` 上传文件类型限制，例如``png|jpeg|gif|jsp``
    * ``options.File`` ``type: String`` ``input[type="file"]``选择器，默认为``input[type="file"]`` 兼容选择上传
    * ``options.drop`` ``type: Function`` 回调
    * ``options.dragover`` ``type: Function`` 回调
    * ``options.dragenter`` ``type: Function`` 回调
    * ``options.dragleave`` ``type: Function`` 回调


### Options
[config](https://github.com/aimeejs/config)
```js
drag.config.get(key)
drag.config.set(key, value)
```
