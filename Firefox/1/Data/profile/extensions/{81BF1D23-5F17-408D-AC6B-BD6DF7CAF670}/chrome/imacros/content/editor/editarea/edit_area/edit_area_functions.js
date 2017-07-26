	
	EditArea.prototype.replace_tab= function(text){
		return text.replace(/((\n?)([^\t\n]*)\t)/gi, editArea.smartTab);		
	};
	
	
	EditArea.prototype.smartTab= function(){
		val="                   ";
		return EditArea.prototype.smartTab.arguments[2] + EditArea.prototype.smartTab.arguments[3] + val.substr(0, editArea.tab_nb_char - (EditArea.prototype.smartTab.arguments[3].length)%editArea.tab_nb_char);
	};
	
	EditArea.prototype.show_waiting_screen= function(){
		width= this.editor_area.offsetWidth;
		height= this.editor_area.offsetHeight;
		if(this.nav['isGecko'] || this.nav['isOpera'] || this.nav['isIE']>=7){
			width-=2;
			height-=2;
		}
		this.processing_screen.style.display="block";
		this.processing_screen.style.width= width+"px";
		this.processing_screen.style.height= height+"px";
		this.waiting_screen_displayed= true;
	};
	
	EditArea.prototype.hide_waiting_screen= function(){
		this.processing_screen.style.display="none";
		this.waiting_screen_displayed= false;
	};
	
	EditArea.prototype.add_style= function(styles){
		if(styles.length>0){
			newcss = document.createElement("style");
			newcss.type="text/css";
			newcss.media="all";
			document.getElementsByTagName("head")[0].appendChild(newcss);
			cssrules = styles.split("}");
			newcss = document.styleSheets[0];
			if(newcss.rules) { 
				for(i=cssrules.length-2;i>=0;i--) {
					newrule = cssrules[i].split("{");
					newcss.addRule(newrule[0],newrule[1])
				}
			}
			else if(newcss.cssRules) { 
				for(i=cssrules.length-1;i>=0;i--) {
					if(cssrules[i].indexOf("{")!=-1){
						newcss.insertRule(cssrules[i]+"}",0);
					}
				}
			}
		}
	};
	
	EditArea.prototype.set_font= function(family, size){
		var elems= new Array("textarea", "content_highlight", "cursor_pos", "end_bracket", "selection_field", "line_number");
		if(family && family!="")
			this.settings["font_family"]= family;
		if(size && size>0)
			this.settings["font_size"]=size;
		if(this.nav['isOpera'])	
			this.settings['font_family']="monospace";
		var elem_font=$("area_font_size");	
		if(elem_font){	
			for(var i=0; i<elem_font.length; i++){
				if(elem_font.options[i].value && elem_font.options[i].value == this.settings["font_size"])
						elem_font.options[i].selected=true;
			}
		}
		
		
		elem	= $("test_font_size");
		elem.style.fontFamily= ""+this.settings["font_family"];
		elem.style.fontSize= this.settings["font_size"]+"pt";				
		elem.innerHTML="0";		
		this.lineHeight= elem.offsetHeight;

		
		for(var i=0; i<elems.length; i++){
			var elem= $(elems[i]);	
			elem.style.fontFamily= this.settings["font_family"];
			elem.style.fontSize= this.settings["font_size"]+"pt";
			elem.style.lineHeight= this.lineHeight+"px";

		}
		if(this.nav['isOpera']){	
			var start=this.textarea.selectionStart;
			var end= this.textarea.selectionEnd;
			var parNod = this.textarea.parentNode, nxtSib = this.textarea.nextSibling;
			parNod.removeChild(this.textarea); parNod.insertBefore(this.textarea, nxtSib);
			this.area_select(start, end-start);
		}
		
		this.add_style("pre{font-family:"+this.settings["font_family"]+"}");
		
		
		

		
		
		this.last_line_selected=-1;
		
		this.last_selection= new Array();
		this.resync_highlight();
		
	
		
		
	};
	
	EditArea.prototype.change_font_size= function(){
		var size=$("area_font_size").value;
		if(size>0)
			this.set_font("", size);			
	};
	
	
	EditArea.prototype.open_inline_popup= function(popup_id){
		this.close_all_inline_popup();
		var popup= $(popup_id);		
		var editor= $("editor");
		
		
		for(var i=0; i<this.inlinePopup.length; i++){
			if(this.inlinePopup[i]["popup_id"]==popup_id){
				var icon= $(this.inlinePopup[i]["icon_id"]);
				if(icon){
					this.switchClassSticky(icon, 'editAreaButtonSelected', true);			
					break;
				}
			}
		}
		
		popup.style.height="auto";
		popup.style.overflow= "visible";
			
		if(document.body.offsetHeight< popup.offsetHeight){
			popup.style.height= (document.body.offsetHeight-10)+"px";
			popup.style.overflow= "auto";
		}
		
		if(!popup.positionned){
			var new_left= editor.offsetWidth /2 - popup.offsetWidth /2;
			var new_top= editor.offsetHeight /2 - popup.offsetHeight /2;
			
			
			
			popup.style.left= new_left+"px";
			popup.style.top= new_top+"px";
			popup.positionned=true;
		}
		popup.style.visibility="visible";
		
		
	};

	EditArea.prototype.close_inline_popup= function(popup_id){
		var popup= $(popup_id);		
		
		for(var i=0; i<this.inlinePopup.length; i++){
			if(this.inlinePopup[i]["popup_id"]==popup_id){
				var icon= $(this.inlinePopup[i]["icon_id"]);
				if(icon){
					this.switchClassSticky(icon, 'editAreaButtonNormal', false);			
					break;
				}
			}
		}
		
		popup.style.visibility="hidden";	
	};
	
	EditArea.prototype.close_all_inline_popup= function(e){
		for(var i=0; i<this.inlinePopup.length; i++){
			this.close_inline_popup(this.inlinePopup[i]["popup_id"]);		
		}
		this.textarea.focus();
	};
	
	EditArea.prototype.show_help= function(){
		
		this.open_inline_popup("edit_area_help");
		
	};
			
	EditArea.prototype.new_document= function(){
		this.textarea.value="";
		this.area_select(0,0);
	};
	
	EditArea.prototype.get_all_toolbar_height= function(){
		var area= $("editor");
		var results= parent.getChildren(area, "div", "class", "area_toolbar", "all", "0");	
		
		var height=0;
		for(var i=0; i<results.length; i++){			
			height+= results[i].offsetHeight;
		}
		
		return height;
	};
	
	EditArea.prototype.go_to_line= function(line){	
		if(!line)
		{	
			var icon= $("go_to_line");
			if(icon != null){
				this.restoreClass(icon);
				this.switchClassSticky(icon, 'editAreaButtonSelected', true);
			}
			
			line= prompt(this.get_translation("go_to_line_prompt"));
			if(icon != null)
				this.switchClassSticky(icon, 'editAreaButtonNormal', false);
		}
		if(line && line!=null && line.search(/^[0-9]+$/)!=-1){
			var start=0;
			var lines= this.textarea.value.split("\n");
			if(line > lines.length)
				start= this.textarea.value.length;
			else{
				for(var i=0; i<Math.min(line-1, lines.length); i++)
					start+= lines[i].length + 1;
			}
			this.area_select(start, 0);
		}
		
		
	};
	
	
	EditArea.prototype.change_smooth_selection_mode= function(setTo){
		
		if(this.do_highlight)
			return;
			
		if(setTo != null){
			if(setTo === false)
				this.smooth_selection=true;
			else
				this.smooth_selection=false;
		}
		var icon= $("change_smooth_selection");
		this.textarea.focus();
		if(this.smooth_selection===true){
			
			
			
			
			this.switchClassSticky(icon, 'editAreaButtonNormal', false);
			
			this.smooth_selection=false;
			this.selection_field.style.display= "none";
			$("cursor_pos").style.display= "none";
			$("end_bracket").style.display= "none";
		}else{
			
			
			this.switchClassSticky(icon, 'editAreaButtonSelected', false);
			this.smooth_selection=true;
			this.selection_field.style.display= "block";
			$("cursor_pos").style.display= "block";
			$("end_bracket").style.display= "block";
		}	
	};
	
	
	
	EditArea.prototype.scroll_to_view= function(show){
		if(!this.smooth_selection)
			return;
		var zone= $("result");
		
		
		var cursor_pos_top= $("cursor_pos").cursor_top;
		if(show=="bottom")
			cursor_pos_top+= (this.last_selection["line_nb"]-1)* this.lineHeight;
			
		var max_height_visible= zone.clientHeight + zone.scrollTop;
		var miss_top= cursor_pos_top + this.lineHeight - max_height_visible;
		if(miss_top>0){
			
			zone.scrollTop=  zone.scrollTop + miss_top;
		}else if( zone.scrollTop > cursor_pos_top){
			
			
			zone.scrollTop= cursor_pos_top;	 
		}
		
		var cursor_pos_left= $("cursor_pos").cursor_left;
		var max_width_visible= zone.clientWidth + zone.scrollLeft;
		var miss_left= cursor_pos_left + 10 - max_width_visible;
		if(miss_left>0){			
			zone.scrollLeft= zone.scrollLeft + miss_left + 50;
		}else if( zone.scrollLeft > cursor_pos_left){
			zone.scrollLeft= cursor_pos_left ;
		}else if( zone.scrollLeft == 45){
			
			zone.scrollLeft=0;
		}
	};
	
	EditArea.prototype.check_undo= function(only_once){
		if(!editAreas[this.id])
			return false;
		if(this.textareaFocused && editAreas[this.id]["displayed"]==true){
			var text=this.textarea.value;
			if(this.previous.length<=1)
				this.switchClassSticky($("undo"), 'editAreaButtonDisabled', true);
		
			if(!this.previous[this.previous.length-1] || this.previous[this.previous.length-1]["text"] != text){
				this.previous.push({"text": text, "selStart": this.textarea.selectionStart, "selEnd": this.textarea.selectionEnd});
				if(this.previous.length > this.settings["max_undo"]+1)
					this.previous.shift();
				
			}
			if(this.previous.length >= 2)
				this.switchClassSticky($("undo"), 'editAreaButtonNormal', false);		
		}

		if(!only_once)
			setTimeout("editArea.check_undo()", 3000);
	};
	
	EditArea.prototype.undo= function(){
		
		if(this.previous.length > 0){
			if(this.nav['isIE'])
				this.getIESelection();
		
			this.next.push({"text": this.textarea.value, "selStart": this.textarea.selectionStart, "selEnd": this.textarea.selectionEnd});
			var prev= this.previous.pop();
			if(prev["text"]==this.textarea.value && this.previous.length > 0)
				prev=this.previous.pop();						
			this.textarea.value= prev["text"];
			this.last_undo= prev["text"];
			this.area_select(prev["selStart"], prev["selEnd"]-prev["selStart"]);
			this.switchClassSticky($("redo"), 'editAreaButtonNormal', false);
			this.resync_highlight(true);
			
			this.check_file_changes();
		}
	};
	
	EditArea.prototype.redo= function(){
		if(this.next.length > 0){
			
			
			var next= this.next.pop();
			this.previous.push(next);
			this.textarea.value= next["text"];
			this.last_undo= next["text"];
			this.area_select(next["selStart"], next["selEnd"]-next["selStart"]);
			this.switchClassSticky($("undo"), 'editAreaButtonNormal', false);
			this.resync_highlight(true);
			this.check_file_changes();
		}
		if(	this.next.length == 0)
			this.switchClassSticky($("redo"), 'editAreaButtonDisabled', true);
	};
	
	EditArea.prototype.check_redo= function(){
		if(editArea.next.length == 0 || editArea.textarea.value!=editArea.last_undo){
			editArea.next= new Array();	
			editArea.switchClassSticky($("redo"), 'editAreaButtonDisabled', true);
		}
		else
		{
			this.switchClassSticky($("redo"), 'editAreaButtonNormal', false);
		}
	};
	
	
	
	EditArea.prototype.switchClass = function(element, class_name, lock_state) {
		var lockChanged = false;
	
		if (typeof(lock_state) != "undefined" && element != null) {
			element.classLock = lock_state;
			lockChanged = true;
		}
	
		if (element != null && (lockChanged || !element.classLock)) {
			element.oldClassName = element.className;
			element.className = class_name;
		}
	};
	
	EditArea.prototype.restoreAndSwitchClass = function(element, class_name) {
		if (element != null && !element.classLock) {
			this.restoreClass(element);
			this.switchClass(element, class_name);
		}
	};
	
	EditArea.prototype.restoreClass = function(element) {
		if (element != null && element.oldClassName && !element.classLock) {
			element.className = element.oldClassName;
			element.oldClassName = null;
		}
	};
	
	EditArea.prototype.setClassLock = function(element, lock_state) {
		if (element != null)
			element.classLock = lock_state;
	};
	
	EditArea.prototype.switchClassSticky = function(element, class_name, lock_state) {
		var lockChanged = false;
		if (typeof(lock_state) != "undefined" && element != null) {
			element.classLock = lock_state;
			lockChanged = true;
		}
	
		if (element != null && (lockChanged || !element.classLock)) {
			element.className = class_name;
			element.oldClassName = class_name;
		}
	};
	
	
	EditArea.prototype.scroll_page= function(params){
		var dir= params["dir"];
		var shift_pressed= params["shift"];
		screen_height=$("result").clientHeight;
		var lines= this.textarea.value.split("\n");		
		var new_pos=0;
		var length=0;
		var char_left=0;
		var line_nb=0;
		if(dir=="up"){
			
			
			var scroll_line= Math.ceil((screen_height -30)/this.lineHeight);
			if(this.last_selection["selec_direction"]=="up"){
				for(line_nb=0; line_nb< Math.min(this.last_selection["line_start"]-scroll_line, lines.length); line_nb++){
					new_pos+= lines[line_nb].length + 1;
				}
				char_left=Math.min(lines[Math.min(lines.length-1, line_nb)].length, this.last_selection["curr_pos"]-1);
				if(shift_pressed)
					length=this.last_selection["selectionEnd"]-new_pos-char_left;	
				this.area_select(new_pos+char_left, length);
				view="top";
			}else{			
				view="bottom";
				for(line_nb=0; line_nb< Math.min(this.last_selection["line_start"]+this.last_selection["line_nb"]-1-scroll_line, lines.length); line_nb++){
					new_pos+= lines[line_nb].length + 1;
				}
				char_left=Math.min(lines[Math.min(lines.length-1, line_nb)].length, this.last_selection["curr_pos"]-1);
				if(shift_pressed){
					
					start= Math.min(this.last_selection["selectionStart"], new_pos+char_left);
					length= Math.max(new_pos+char_left, this.last_selection["selectionStart"] )- start ;
					if(new_pos+char_left < this.last_selection["selectionStart"])
						view="top";
				}else
					start=new_pos+char_left;
				this.area_select(start, length);
				
			}
		}else{
			
			
			var scroll_line= Math.floor((screen_height-30)/this.lineHeight);				
			if(this.last_selection["selec_direction"]=="down"){
				view="bottom";
				for(line_nb=0; line_nb< Math.min(this.last_selection["line_start"]+this.last_selection["line_nb"]-2+scroll_line, lines.length); line_nb++){
					if(line_nb==this.last_selection["line_start"]-1)
						char_left= this.last_selection["selectionStart"] -new_pos;
					new_pos+= lines[line_nb].length + 1;
									
				}
				if(shift_pressed){
					length=Math.abs(this.last_selection["selectionStart"]-new_pos);	
					length+=Math.min(lines[Math.min(lines.length-1, line_nb)].length, this.last_selection["curr_pos"]);
					
					this.area_select(Math.min(this.last_selection["selectionStart"], new_pos), length);
				}else{
					this.area_select(new_pos+char_left, 0);
				}
				
			}else{
				view="top";
				for(line_nb=0; line_nb< Math.min(this.last_selection["line_start"]+scroll_line-1, lines.length, lines.length); line_nb++){
					if(line_nb==this.last_selection["line_start"]-1)
						char_left= this.last_selection["selectionStart"] -new_pos;
					new_pos+= lines[line_nb].length + 1;									
				}
				if(shift_pressed){
					length=Math.abs(this.last_selection["selectionEnd"]-new_pos-char_left);	
					length+=Math.min(lines[Math.min(lines.length-1, line_nb)].length, this.last_selection["curr_pos"])- char_left-1;
					
					this.area_select(Math.min(this.last_selection["selectionEnd"], new_pos+char_left), length);
					if(new_pos+char_left > this.last_selection["selectionEnd"])
						view="bottom";
				}else{
					this.area_select(new_pos+char_left, 0);
				}
				
			}
		}		
		
		this.check_line_selection();
		this.scroll_to_view(view);
	};
	
	EditArea.prototype.start_resize= function(e){		
		parent.editAreaLoader.resize["id"]= editArea.id;		
		parent.editAreaLoader.resize["start_x"]= (e)? e.pageX : event.x + document.body.scrollLeft;		
		parent.editAreaLoader.resize["start_y"]= (e)? e.pageY : event.y + document.body.scrollTop;
		if(editArea.nav['isIE']){
			editArea.textarea.focus();
			editArea.getIESelection();
		}
		parent.editAreaLoader.resize["selectionStart"]= editArea.textarea.selectionStart;
		parent.editAreaLoader.resize["selectionEnd"]= editArea.textarea.selectionEnd;
		
		parent.editAreaLoader.start_resize_area();
	};
	
	EditArea.prototype.toggle_full_screen= function(to){
		if(typeof(to)=="undefined")
			to= !this.fullscreen['isFull'];
		var old= this.fullscreen['isFull'];
		this.fullscreen['isFull']= to;
		var icon= $("fullscreen");
		if(to && to!=old)
		{	
			var selStart= this.textarea.selectionStart;
			var selEnd= this.textarea.selectionEnd;
			var html= parent.document.getElementsByTagName("html")[0];
			var frame= parent.document.getElementById("frame_"+this.id);

			this.fullscreen['old_overflow']= parent.get_css_property(html, "overflow");
			this.fullscreen['old_height']= parent.get_css_property(html, "height");
			this.fullscreen['old_width']= parent.get_css_property(html, "width");
			this.fullscreen['old_scrollTop']= html.scrollTop;
			this.fullscreen['old_scrollLeft']= html.scrollLeft;
			this.fullscreen['old_zIndex']= parent.get_css_property(frame, "z-index");
			if(this.nav['isOpera']){
				html.style.height= "100%";
				html.style.width= "100%";	
			}
			html.style.overflow= "hidden";
			html.scrollTop=0;
			html.scrollLeft=0;
			
		
			

			
			
			frame.style.position="absolute";
			frame.style.width= html.clientWidth+"px";
			frame.style.height= html.clientHeight+"px";
			frame.style.display="block";
			frame.style.zIndex="999999";
			frame.style.top="0px";
			frame.style.left="0px";
			
			
			
			frame.style.top= "-"+parent.calculeOffsetTop(frame)+"px";
			frame.style.left= "-"+parent.calculeOffsetLeft(frame)+"px";
			
		
		
		
			
			this.switchClassSticky(icon, 'editAreaButtonSelected', false);
			this.fullscreen['allow_resize']= this.resize_allowed;
			this.allow_resize(false);
	
			
			
		
			
			if(this.nav['isFirefox']){
				parent.editAreaLoader.execCommand(this.id, "update_size();");
				this.area_select(selStart, selEnd-selStart);
				this.scroll_to_view();
				this.focus();
			}else{
				setTimeout("parent.editAreaLoader.execCommand('"+ this.id +"', 'update_size();');editArea.focus();", 10);
			}	
			
	
		}
		else if(to!=old)
		{	
			var selStart= this.textarea.selectionStart;
			var selEnd= this.textarea.selectionEnd;
			
			var frame= parent.document.getElementById("frame_"+this.id);	
			frame.style.position="static";
			frame.style.zIndex= this.fullscreen['old_zIndex'];
		
			var html= parent.document.getElementsByTagName("html")[0];
		
		
			if(this.nav['isOpera']){
				html.style.height= "auto"; 
				html.style.width= "auto";
				html.style.overflow= "auto";
			}else if(this.nav['isIE'] && parent!=top){	
				html.style.overflow= "auto";
			}
			else
				html.style.overflow= this.fullscreen['old_overflow'];
			html.scrollTop= this.fullscreen['old_scrollTop'];
			html.scrollTop= this.fullscreen['old_scrollLeft'];
		
			parent.editAreaLoader.hide(this.id);
			parent.editAreaLoader.show(this.id);
			
			this.switchClassSticky(icon, 'editAreaButtonNormal', false);
			if(this.fullscreen['allow_resize'])
				this.allow_resize(this.fullscreen['allow_resize']);
			if(this.nav['isFirefox']){
				this.area_select(selStart, selEnd-selStart);
				setTimeout("editArea.scroll_to_view();", 10);
			}			
			
			
		}
		
	};
	
	EditArea.prototype.allow_resize= function(allow){
		var resize= $("resize_area");
		if(allow){
			
			resize.style.visibility="visible";
			parent.editAreaLoader.add_event(resize, "mouseup", editArea.start_resize);
		}else{
			resize.style.visibility="hidden";
			parent.editAreaLoader.remove_event(resize, "mouseup", editArea.start_resize);
		}
		this.resize_allowed= allow;
	};
	
	
	EditArea.prototype.change_syntax= function(new_syntax, is_waiting){
	
		
		if(new_syntax==this.settings['syntax'])
			return true;
		
		
		var founded= false;
		for(var i=0; i<this.syntax_list.length; i++)
		{
			if(this.syntax_list[i]==new_syntax)
				founded= true;
		}
		
		if(founded==true)
		{
			
			if(!parent.editAreaLoader.load_syntax[new_syntax])
			{
				
				if(!is_waiting)
					parent.editAreaLoader.load_script(parent.editAreaLoader.baseURL + "reg_syntax/" + new_syntax + ".js");
				setTimeout("editArea.change_syntax('"+ new_syntax +"', true);", 100);
				this.show_waiting_screen();
			}
			else
			{
				if(!this.allready_used_syntax[new_syntax])
				{	
					
					parent.editAreaLoader.init_syntax_regexp();
					
					this.add_style(parent.editAreaLoader.syntax[new_syntax]["styles"]);
					this.allready_used_syntax[new_syntax]=true;
				}
				
				var sel= $("syntax_selection");
				if(sel && sel.value!=new_syntax)
				{
					for(var i=0; i<sel.length; i++){
						if(sel.options[i].value && sel.options[i].value == new_syntax)
							sel.options[i].selected=true;
					}
				}
				
			
				this.settings['syntax']= new_syntax;
				this.resync_highlight(true);
				this.hide_waiting_screen();
				return true;
			}
		}
		return false;
	};
	
	
	
	EditArea.prototype.set_editable= function(is_editable){
		if(is_editable)
		{
			document.body.className= "";
			this.textarea.readOnly= false;
			this.is_editable= true;
		}
		else
		{
			document.body.className= "non_editable";
			this.textarea.readOnly= true;
			this.is_editable= false;
		}
		
		if(editAreas[this.id]["displayed"]==true)
			this.update_size();
	};
	
	
	
	EditArea.prototype.set_wrap_text= function(to){
		this.settings['wrap_text']	= to;
		if( this.settings['wrap_text'] )
		{
			wrap_mode = 'soft';
			this.container.className+= ' wrap_text';
		}
		else
		{
			wrap_mode = 'off';
			this.container.className= this.container.className.replace(/ wrap_text/g, '');
		}
		
		
		var t= this.textarea;
		t.wrap= wrap_mode;
		t.setAttribute('wrap', wrap_mode);
		
		if(!this.nav['isIE']){
			var start=t.selectionStart, end= t.selectionEnd;
			var parNod = t.parentNode, nxtSib = t.nextSibling;
			parNod.removeChild(t); parNod.insertBefore(t, nxtSib);
			this.area_select(start, end-start);
	
		}
	};	
	
	
	
	EditArea.prototype.open_file= function(settings){
		
		if(settings['id']!="undefined")
		{
			var id= settings['id'];
			
			var new_file= new Object();
			new_file['id']= id;
			new_file['title']= id;
			new_file['text']= "";
			new_file['last_selection']= "";		
			new_file['last_text_to_highlight']= "";
			new_file['last_hightlighted_text']= "";
			new_file['previous']= new Array();
			new_file['next']= new Array();
			new_file['last_undo']= "";
			new_file['smooth_selection']= this.settings['smooth_selection'];
			new_file['do_highlight']= this.settings['start_highlight'];
			new_file['syntax']= this.settings['syntax'];
			new_file['scroll_top']= 0;
			new_file['scroll_left']= 0;
			new_file['selection_start']= 0;
			new_file['selection_end']= 0;
			new_file['edited']= false;
			new_file['font_size']= this.settings["font_size"];
			new_file['font_family']= this.settings["font_family"];
			new_file['toolbar']= {'links':{}, 'selects': {}};
			new_file['compare_edited_text']= new_file['text'];
			
			
			this.files[id]= new_file;
			this.update_file(id, settings);
			this.files[id]['compare_edited_text']= this.files[id]['text'];
			
			
			var html_id= 'tab_file_'+encodeURIComponent(id);
			this.filesIdAssoc[html_id]= id;
			this.files[id]['html_id']= html_id;
		
			if(!$(this.files[id]['html_id']) && id!="")
			{
				
				this.tab_browsing_area.style.display= "block";
				var elem= document.createElement('li');
				elem.id= this.files[id]['html_id'];
				var close= "<img src=\""+ parent.editAreaLoader.baseURL +"images/close.gif\" title=\""+ this.get_translation('close_tab', 'word') +"\" onclick=\"editArea.execCommand('close_file', editArea.filesIdAssoc['"+ html_id +"']);return false;\" class=\"hidden\" onmouseover=\"this.className=''\" onmouseout=\"this.className='hidden'\" />";
				elem.innerHTML= "<a onclick=\"javascript:editArea.execCommand('switch_to_file', editArea.filesIdAssoc['"+ html_id +"']);\" selec=\"none\"><b><span><strong class=\"edited\">*</strong>"+ this.files[id]['title'] + close +"</span></b></a>";
				$('tab_browsing_list').appendChild(elem);
				var elem= document.createElement('text');
				this.update_size();
			}
			
			
			if(id!="")
				this.execCommand('file_open', this.files[id]);
			
			this.switch_to_file(id, true);
			return true;
		}
		else
			return false;
	};
	
	
	EditArea.prototype.close_file= function(id){
		if(this.files[id])
		{
			this.save_file(id);
			
			
			if(this.execCommand('file_close', this.files[id])!==false)
			{
				
				var li= $(this.files[id]['html_id']);
				li.parentNode.removeChild(li);
				
				if(id== this.curr_file)
				{
					var next_file= "";
					var is_next= false;
					for(var i in this.files)
					{
						if(is_next)
						{
							next_file= i;
							break;
						}
						else if(i==id)
							is_next= true;
						else
							next_file= i;
					}
					
					this.switch_to_file(next_file);
				}
				
				delete (this.files[id]);
				this.update_size();
			}	
		}
	};
	
	
	EditArea.prototype.save_file= function(id){
		if(this.files[id])
		{
			var save= this.files[id];
			save['last_selection']= this.last_selection;		
			save['last_text_to_highlight']= this.last_text_to_highlight;
			save['last_hightlighted_text']= this.last_hightlighted_text;
			save['previous']= this.previous;
			save['next']= this.next;
			save['last_undo']= this.last_undo;
			save['smooth_selection']= this.smooth_selection;
			save['do_highlight']= this.do_highlight;
			save['syntax']= this.settings['syntax'];
			save['text']= this.textarea.value;
			save['scroll_top']= this.result.scrollTop;
			save['scroll_left']= this.result.scrollLeft;
			save['selection_start']= this.last_selection["selectionStart"];
			save['selection_end']= this.last_selection["selectionEnd"];
			save['font_size']= this.settings["font_size"];
			save['font_family']= this.settings["font_family"];
			save['toolbar']= {'links':{}, 'selects': {}};
			
			var links= $("toolbar_1").getElementsByTagName("a");
			for(var i=0; i<links.length; i++)
			{
				if(links[i].getAttribute('fileSpecific')=='yes')
				{
					var save_butt= new Object();
					var img= links[i].getElementsByTagName('img')[0];
					save_butt['classLock']= img.classLock;
					save_butt['className']= img.className;
					save_butt['oldClassName']= img.oldClassName;
					
					save['toolbar']['links'][links[i].id]= save_butt;
				}
			}
			
			var selects= $("toolbar_1").getElementsByTagName("select");
			for(var i=0; i<selects.length; i++)
			{
				if(selects[i].getAttribute('fileSpecific')=='yes')
				{
					save['toolbar']['selects'][selects[i].id]= selects[i].value;
				}
			}
				
			this.files[id]= save;
			
			return save;
		}
		else
			return false;
	};
	
	
	EditArea.prototype.update_file= function(id, new_values){
		for(var i in new_values)
		{
			this.files[id][i]= new_values[i];
		}
	};
	
	
	EditArea.prototype.display_file= function(id){
		
		if(id=='')
		{
			this.textarea.readOnly= true;
			this.tab_browsing_area.style.display= "none";
			$("no_file_selected").style.display= "block";
			this.result.className= "empty";
			if(!this.files[''])
				this.open_file({id: ''});
		}
		else
		{
			this.result.className= "";
			this.textarea.readOnly= !this.is_editable;
			$("no_file_selected").style.display= "none";
			this.tab_browsing_area.style.display= "block";
		}
		
		this.check_redo(true);
		this.check_undo(true);
		this.curr_file= id;
		
		
		var lis= this.tab_browsing_area.getElementsByTagName('li');
		for(var i=0; i<lis.length; i++)
		{
			if(lis[i].id == this.files[id]['html_id'])
				lis[i].className='selected';
			else
				lis[i].className='';
		}
		
		
		var new_file= this.files[id];
	
		
		this.textarea.value= new_file['text'];
		
		
		this.set_font(new_file['font_family'], new_file['font_size']);
		
		
		this.area_select(new_file['last_selection']['selection_start'], new_file['last_selection']['selection_end'] - new_file['last_selection']['selection_start']);
		this.manage_size(true);
		this.result.scrollTop= new_file['scroll_top'];
		this.result.scrollLeft= new_file['scroll_left'];
		
		
		this.previous=	new_file['previous'];
		this.next=	new_file['next'];
		this.last_undo=	new_file['last_undo'];
		this.check_redo(true);
		this.check_undo(true);
		
		
		this.execCommand("change_highlight", new_file['do_highlight']);
		this.execCommand("change_syntax", new_file['syntax']);
		
		
		this.execCommand("change_smooth_selection_mode", new_file['smooth_selection']);
			
		
		var links= new_file['toolbar']['links'];
		for(var i in links)
		{
			if(img= $(i).getElementsByTagName('img')[0])
			{
				var save_butt= new Object();
				img.classLock= links[i]['classLock'];
				img.className= links[i]['className'];
				img.oldClassName= links[i]['oldClassName'];
			}
		}
		
		var selects= new_file['toolbar']['selects'];
		for(var i in selects)
		{
			var options= $(i).options;
			for(var j=0; j<options.length; j++)
			{
				if(options[j].value == selects[i])
					$(i).options[j].selected=true;
			}
		}
	
	};

	
	EditArea.prototype.switch_to_file= function(file_to_show, force_refresh){
		if(file_to_show!=this.curr_file || force_refresh)
		{
			this.save_file(this.curr_file);
			if(this.curr_file!='')
				this.execCommand('file_switch_off', this.files[this.curr_file]);
			this.display_file(file_to_show);
			if(file_to_show!='')
				this.execCommand('file_switch_on', this.files[file_to_show]);
		}
	};

	
	EditArea.prototype.get_file= function(id){
		if(id==this.curr_file)
			this.save_file(id);
		return this.files[id];
	};
	
	
	EditArea.prototype.get_all_files= function(){
		tmp_files= this.files;
		this.save_file(this.curr_file);
		if(tmp_files[''])
			delete(this.files['']);
		return tmp_files;
	};
	
	
	
	EditArea.prototype.check_file_changes= function(){
	
		var id= this.curr_file;
		if(this.files[id] && this.files[id]['compare_edited_text']!=undefined)
		{
			if(this.files[id]['compare_edited_text'].length==this.textarea.value.length && this.files[id]['compare_edited_text']==this.textarea.value)
			{
				if(this.files[id]['edited']!= false)
					this.set_file_edited_mode(id, false);
			}
			else
			{
				if(this.files[id]['edited']!= true)
					this.set_file_edited_mode(id, true);
			}
		}
	};
	
	
	EditArea.prototype.set_file_edited_mode= function(id, to){
		
		if(this.files[id] && $(this.files[id]['html_id']))
		{
			var link= $(this.files[id]['html_id']).getElementsByTagName('a')[0];
			if(to==true)
			{
				link.className= 'edited';
			}
			else
			{
				link.className= '';
				if(id==this.curr_file)
					text= this.textarea.value;
				else
					text= this.files[id]['text'];
				this.files[id]['compare_edited_text']= text;
			}
				
			this.files[id]['edited']= to;
		}
	};

	EditArea.prototype.set_show_line_colors = function(new_value){
		this.show_line_colors = new_value;
		
		if( new_value )
			this.selection_field.className	+= ' show_colors';
		else
			this.selection_field.className	= this.selection_field.className.replace( / show_colors/g, '' );
	};