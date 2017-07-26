



Components.utils.import("resource://imacros/utils.js");


function onAccept () {
    if("arguments" in window && window.arguments.length > 0) {
        var period = document.getElementById("imacros-wait-period");
        if (!/^[1-9]\d*$/.test(period.value)) {
            window.alert("Numeric value expected");
            period.focus();
            return false;
        } else {
            window.arguments[0].period = period.value;
            window.arguments[0].confirm = true;
            window.close();
        }
    } else {
        window.close();
    }
}

function onCancel() {
    if("arguments" in window && window.arguments.length > 0) {
        window.arguments[0].confirm = false;
        window.close();
    } else {
        window.close();
    }
}
