(function(){
    const host = plugin.settings.get('remote')
    let fileToPlay;
    httpAsString(host + '/list', (r) => {
        if (typeof r === 'string') {
            let list = JSON.parse(r).sort((a, b) => b.modified - a.modified)

            plugin.createShortcut("最近的云端文档", "自动播放", "play", (p, c) => {
                const dt = new Date()
        
                let rename = (dt.getMonth() + 1) + "." + dt.getDate() + ".docx"

                const autoPattern = plugin.settings.get("auto_pattern");
                let uri;
                if (autoPattern === "") {
                    uri = "latest"
                } else {
                    const regex = new RegExp(autoPattern);
                    let latestFile = ""
                    for (let i in list) {
                        const file = list[i]
                        if (regex.test(file.name)) {
                            latestFile = file.name
                        }
                    }
                    if (latestFile === "") {
                        uri = "latest"
                    } else {
                        uri = "query/" + latestFile
                        rename = latestFile
                    }
                }
                download(host + '/' + uri, rename, (path) => {
                    if (typeof path === 'string') {
                        c(path);
        
                        addEventListener("documentLoaded", (v) => {
                            fileToPlay = path
                        });
                    } else if (typeof path === 'number') {
                        showInfoBar("AutoPlay", "无法打开最近的文档: Http " + path, "error")
                        c()
                    }
                })
            })

            const maxItems = plugin.settings.get("max_items")
            for (let i = 0; i < (list.length > maxItems ? maxItems : list.length); i++) {
                let file = list[i]

                plugin.createShortcut(file.name, "机器人托管的文件", (p, c) => {
                    download(host + '/query/' + file.name, file.name, (path) => {
                        if (typeof path === 'string') {
                            c(path)
                        } else {
                            showInfoBar("AutoPlay", "无法下载" + file.name + ": "+ path, "error")
                            c()
                        }
                    })
                })
            }
        } else if (typeof r === 'number') {
            showInfoBar("AutoPlay", "无法获取文件列表: Http " + r, "error")
        }
    })

    addEventListener('documentLoaded', (v) => {
        v.runEmbedded('autoplay')
        if (v.info.path == fileToPlay) {
            v.runScript("autoplay")
        }
    })
})()

addEventListener("settingsChanged", (s) => {
    if (s.key === "max_items" || s.key === "remote") {
        showInfoBar("AutoPlay", "重新启动以应用该设置")
    }
})