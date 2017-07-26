




Components.utils.import("resource://imacros/utils.js");

function saveMacro(action) {
    try {
        if(!("arguments" in window) || !window.arguments.length) {
            return;
        }

        var fp = imns.Cc["@mozilla.org/filepicker;1"]
            .createInstance(imns.Ci.nsIFilePicker);
        fp.init(window, "Select file to save", imns.Ci.nsIFilePicker.modeSave);

        fp.defaultString = window.arguments[0].filename;
        
        if (/\.js$/.test(window.arguments[0].filename))
            fp.appendFilter("iMacros script", "*.js");
        else if (/\.iim$/.test(window.arguments[0].filename))
            fp.appendFilter("iMacros macro", "*.iim");
        fp.appendFilters(imns.Ci.nsIFilePicker.filterAll);

        fp.filterIndex = 0;
        var rootdir = imns.Pref.getFilePref("defsavepath");
        fp.displayDirectory = rootdir;
            
        var r = fp.show();
        if(r == imns.Ci.nsIFilePicker.returnOK ||
           r == imns.Ci.nsIFilePicker.returnReplace) {
            var conv = imns.Cc["@mozilla.org/intl/scriptableunicodeconverter"]
                .createInstance(imns.Ci.nsIScriptableUnicodeConverter);
            conv.charset = 'UTF-8';
            var data = conv.ConvertFromUnicode(window.arguments[0].code);
            
            var seq = String.fromCharCode(239)+
                String.fromCharCode(187)+
                String.fromCharCode(191);
            data = seq + data;
            var file = imns.Cc["@mozilla.org/file/local;1"]
                .createInstance(imns.Ci.nsILocalFile);
            file.initWithPath(fp.file.path);
            if (file.exists())
                file.remove(false);
            var stream = imns.Cc["@mozilla.org/network/file-output-stream;1"]
                .createInstance(imns.Ci.nsIFileOutputStream);
            stream.init(fp.file, 0x04 | 0x08 | 0x20, 0777, 0);
            stream.write(data, data.length);
            stream.close();
        }
    } catch (e) {
        Components.utils.reportError(e);
    }
}


window.onload = function () {
    if("arguments" in window && window.arguments.length > 0) {
        var textbox = document.getElementById("viewfield");
        textbox.value = window.arguments[0].code;
    }
};

