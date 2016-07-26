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
