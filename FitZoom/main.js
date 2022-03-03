addEventListener("documentLoaded", (v) => {
    if (plugin.settings.get("on")) {
        v.zoomFactor = plugin.settings.get("factor")
        v.runEmbedded("gesture")
    }
    //plugin.settings.put("factor", Math.random() * 5);
});

addEventListener("settingsChanged", (e) => {
    if (plugin.settings.get("on") && e.key === "factor") {
        const docs = getOpenedDocuments()
        for (let i in docs) {
            docs[i].zoomFactor = e.value
        }
    }
});