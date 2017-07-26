 




Components.utils.import("resource://imacros/utils.js");


function appendChild() {
    var tree = document.getElementById("commands-tree");
    var treechildren = document.getElementById("treechildren");
    var item = document.createElement("treeitem");
    var row = document.createElement("treerow");
    var cell = document.createElement("treecell");
    row.appendChild(cell);
    item.appendChild(row);
    treechildren.appendChild(item);
    return item;
}

function add() {
    var tree = document.getElementById("commands-tree");
    var item = appendChild();
    var index = tree.view.getIndexOfItem(item);
    tree.view.selection.select(index);
    tree.startEditing(index, tree.columns[0]);
}


function remove() {
    var tree = document.getElementById("commands-tree");
    var treechildren = document.getElementById("treechildren");
    var count = tree.view.selection.getRangeCount();
    var items = [];

    for (var i = 0; i < count; i++) {
	var start = {}, end = {};
	tree.view.selection.getRangeAt(i, start, end);
	for (var idx = start.value; idx <= end.value; idx++) {
            items.push(tree.view.getItemAtIndex(idx));
	}
    }

    for (var i = 0; i < items.length; i++)
        treechildren.removeChild(items[i]);
}


function reset() {
    if (!imns.Dialogs.confirm("Reset list to default values?"))
        return;
        
    
    var default_list = imns.Pref.getCharPref("default-commands-list");
    imns.Pref.setCharPref("commands-list", default_list);

    
    var tree = document.getElementById("commands-tree");

    
    var treechildren = document.getElementById("treechildren");
    while (treechildren.firstChild)
        treechildren.removeChild(treechildren.firstChild);

    
    var list = eval(default_list);
    for (var x in list) {
        var item = appendChild();
        var index = tree.view.getIndexOfItem(item);
        tree.view.setCellText(index, tree.columns[0], x)
        item.setAttribute("regexp", list[x]);
    }
}


function onItemSelected() {
    var tree = document.getElementById("commands-tree");
    var remove_btn = document.getElementById("remove-command");
    var count = tree.view.selection.getRangeCount();

    if (count > 0) {
        remove_btn.disabled = null;
    } else {
        remove_btn.disabled = true;
    }
}



function onTextInput() {
    var tree = document.getElementById("commands-tree");
    var input = tree.inputField;
    var item = tree.view.getItemAtIndex(tree.editingRow);

    if (/^\s*\//.test(input.value)) { 
        if (!/^\s*\/(.*)\/(ig?|gi?)?\s*$/.test(input.value)) {
            input.style.color = "red";
        } else {
            var re_text = RegExp.$1;
            var re_modifier = RegExp.$2;
            try {
                var re = new RegExp(re_text, re_modifier);
                input.style.color = "black";
                item.setAttribute("regexp", re.toSource());
            } catch(e) {
                input.style.color = "red";
            }
        }
    } else {                    
        input.style.color = "black";
        var s = imns.str.trim(input.value);
        if (!s)   
            return;
        
        
        s = s.replace(/([\^\$\.\+\?\|\/\\\(\)\[\]\{\}])/g, "\\$1");
        s = s.replace(/\s+/g, "\\s+");            
        s = s.replace(/\*/g, ".*");               
        s = "^\\s*"+s;
        try {
            var re = new RegExp(s, "i");
            item.setAttribute("regexp", re.toSource());
        } catch(e) {
            Components.utils.reportError(e); 
        }
    }
}


function do_accept() {
    var tree = document.getElementById("commands-tree");
    var list = {};

    for (var i = 0; i < tree.view.rowCount; i++) {
        var item = tree.view.getItemAtIndex(i);
        var text = tree.view.getCellText(i, tree.columns[0]);
        var regexp = item.getAttribute("regexp");
        list[text] = regexp;
    }

    imns.Pref.setCharPref("commands-list", list.toSource());
}



window.addEventListener("load", function() {
    var tree = document.getElementById("commands-tree");
    tree.inputField.setAttribute("oninput","onTextInput()");

    
    var list = imns.Pref.imBranch.prefHasUserValue("commands-list") ?
        imns.Pref.getCharPref("commands-list") :
        imns.Pref.getCharPref("default-commands-list");
    list = eval(list);

    for (var x in list) {
        var item = appendChild();
        var index = tree.view.getIndexOfItem(item);
        tree.view.setCellText(index, tree.columns[0], x)
        item.setAttribute("regexp", list[x]);
    }
    
}, false);
