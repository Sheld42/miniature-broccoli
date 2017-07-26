




Components.utils.import("resource://imacros/utils.js");

function confirmCopy() {
    if("arguments" in window && window.arguments.length > 0) {
        window.arguments[0].copy = true;
        window.arguments[0].path = document.getElementById("demo-folder").value;
    }
    window.close();
}


function cancelCopy() {
    if("arguments" in window && window.arguments.length > 0) {
        window.arguments[0].copy = false;
    }
    window.close();
}




function browseForFolder() {
    try {
        var textbox = document.getElementById("demo-folder");
        var fp = imns.Cc["@mozilla.org/filepicker;1"]
            .createInstance(imns.Ci.nsIFilePicker);
        fp.init(window, " ", imns.Ci.nsIFilePicker.modeGetFolder);
        
        try {
            var rootdir = imns.Cc["@mozilla.org/file/local;1"].
                createInstance(imns.Ci.nsILocalFile);
            rootdir.initWithPath(textbox.value);
            fp.displayDirectory = rootdir;
        } catch (x) {
            
        }
        var rv = fp.show();
        if (rv == imns.Ci.nsIFilePicker.returnOK) {
            var file = fp.file.path.toString();
            textbox.value = file;
        }
    } catch(e) {
        Components.utils.reportError(e);
    }
}



window.onload = function () {
    var demo_folder = document.getElementById("demo-folder");
    var demo_fx = imns.Pref.getFilePref("defsavepath");
    demo_fx.append("Demo-Firefox");
    demo_folder.value = demo_fx.path;
};

