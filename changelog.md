v0.1.3
---
* 优化``getFormData``方法，新增``filename``字段
* 优化``send``方法，改进参数类型
```js
dragcore.send({
    url: '/url',
    data: files,
    error,
    success,
    // 上传进度
    progress: function(e, prog){
        console.log(prog)
        if(prog === '100%'){
            console.log('upload done')
        }
    },
    // XHR.upload
    upload: {
        load,
        error,
        abort,
        progress,
        loadstart,
        loadend
    }
})
```

v0.1.2
---
* Fixbug 修正``drop``事件未传递``event``的问题

v0.1.1
---
* Fixbug 修正files列表获取问题
