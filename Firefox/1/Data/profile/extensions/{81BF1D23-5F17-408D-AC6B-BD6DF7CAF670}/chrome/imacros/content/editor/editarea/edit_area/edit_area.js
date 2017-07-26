

	function EditArea(){
		this.error= false;	
		
		this.inlinePopup= new Array({popup_id: "area_search_replace", icon_id: "search"},
									{popup_id: "edit_area_help", icon_id: "help"});
		this.plugins= new Object();
	
		this.line_number=0;
		
		this.nav=parent.editAreaLoader.nav; 	
		
		this.last_selection=new Object();		
		this.last_text_to_highlight="";
		this.last_hightlighted_text= "";
		this.syntax_list= new Array();
		this.allready_used_syntax= new Object();
		this.check_line_selection_timer= 50;	
		
		this.textareaFocused= false;
		this.highlight_selection_line= null;
		this.previous= new Array();
		this.next= new Array();
		this.last_undo="";
		this.files= new Object();
		this.filesIdAssoc= new Object();
		this.curr_file= '';
		
		this.assocBracket=new Object();
		this.revertAssocBracket= new Object();		
		
		this.assocBracket["("]=")";
		this.assocBracket["{"]="}";
		this.assocBracket["["]="]";		
		for(var index in this.assocBracket){
			this.revertAssocBracket[this.assocBracket[index]]=index;
		}
		this.is_editable= true;
		
		
		
		
		this.lineHeight= 16;
		
		this.tab_nb_char= 8;	
		if(this.nav['isOpera'])
			this.tab_nb_char= 6;

		this.is_tabbing= false;
		
		this.fullscreen= {'isFull': false};
		
		this.isResizing=false;	
		
		
		this.id= area_id;
		this.settings= editAreas[this.id]["settings"];
		
		if((""+this.settings['replace_tab_by_spaces']).match(/^[0-9]+$/))
		{
			this.tab_nb_char= this.settings['replace_tab_by_spaces'];
			this.tabulation="";
			for(var i=0; i<this.tab_nb_char; i++)
				this.tabulation+=" ";
		}else{
			this.tabulation="\t";
		}
			
		
		if(this.settings["syntax_selection_allow"] && this.settings["syntax_selection_allow"].length>0)
			this.syntax_list= this.settings["syntax_selection_allow"].replace(/ /g,"").split(",");
		
		if(this.settings['syntax'])
			this.allready_used_syntax[this.settings['syntax']]=true;
		
		
	};
	
	
	
	EditArea.prototype.update_size= function(){
		
		if(editAreas[editArea.id] && editAreas[editArea.id]["displayed"]==true){
			if(editArea.fullscreen['isFull']){	
				parent.document.getElementById("frame_"+editArea.id).style.width= parent.document.getElementsByTagName("html")[0].clientWidth + "px";
				parent.document.getElementById("frame_"+editArea.id).style.height= parent.document.getElementsByTagName("html")[0].clientHeight + "px";
			}
		
			if(editArea.tab_browsing_area.style.display=='block' && !editArea.nav['isIE'])
			{
				editArea.tab_browsing_area.style.height= "0px";
				editArea.tab_browsing_area.style.height= (editArea.result.offsetTop - editArea.tab_browsing_area.offsetTop -1)+"px";
			}
			
			var height= document.body.offsetHeight - editArea.get_all_toolbar_height() - 4;
			editArea.result.style.height= height +"px";
			
			var width=document.body.offsetWidth -2;
			editArea.result.style.width= width+"px";
			
			
			
			for(var i=0; i<editArea.inlinePopup.length; i++){
				var popup= $(editArea.inlinePopup[i]["popup_id"]);
				var max_left= document.body.offsetWidth- popup.offsetWidth;
				var max_top= document.body.offsetHeight- popup.offsetHeight;
				if(popup.offsetTop>max_top)
					popup.style.top= max_top+"px";
				if(popup.offsetLeft>max_left)
					popup.style.left= max_left+"px";
			}
		}		
	};

	EditArea.prototype.init= function(){
		this.textarea= $("textarea");
		this.container= $("container");
		this.result= $("result");
		this.content_highlight= $("content_highlight");
		this.selection_field= $("selection_field");
		this.processing_screen= $("processing");
		this.editor_area= $("editor");
		this.tab_browsing_area= $("tab_browsing_area");
		
		if(!this.settings['is_editable'])
			this.set_editable(false);
		
		this.set_show_line_colors( this.settings['show_line_colors'] );
		
		if(syntax_selec= $("syntax_selection"))
		{
			
			for(var i=0; i<this.syntax_list.length; i++) {
				var syntax= this.syntax_list[i];
				var option= document.createElement("option");
				option.value= syntax;
				if(syntax==this.settings['syntax'])
					option.selected= "selected";
				option.innerHTML= this.get_translation("syntax_" + syntax, "word");
				syntax_selec.appendChild(option);
			}
		}
		
		
		spans= parent.getChildren($("toolbar_1"), "span", "", "", "all", -1);
		
		for(var i=0; i<spans.length; i++){
		
			id=spans[i].id.replace(/tmp_tool_(.*)/, "$1");
			if(id!= spans[i].id){
				for(var j in this.plugins){
					if(typeof(this.plugins[j].get_control_html)=="function" ){
						html=this.plugins[j].get_control_html(id);
						if(html!=false){
							html= this.get_translation(html, "template");
							var new_span= document.createElement("span");
							new_span.innerHTML= html;				
							var father= spans[i].parentNode;
							spans[i].parentNode.replaceChild(new_span, spans[i]);	
							break; 
						}
					}
				}
			}
		}
		
		
		
		this.textarea.value=editAreas[this.id]["textarea"].value;
		if(this.settings["debug"])
			this.debug=parent.document.getElementById("edit_area_debug_"+this.id);
		
		
		
		
		if($("redo") != null)
			this.switchClassSticky($("redo"), 'editAreaButtonDisabled', true);
		
		
		
		if(typeof(parent.editAreaLoader.syntax[this.settings["syntax"]])!="undefined"){
			for(var i in parent.editAreaLoader.syntax){
				this.add_style(parent.editAreaLoader.syntax[i]["styles"]);
			}
		}
		
		if(this.nav['isOpera'])
			$("editor").onkeypress= keyDown;
		else
			$("editor").onkeydown= keyDown;

		for(var i=0; i<this.inlinePopup.length; i++){
			if(this.nav['isIE'] || this.nav['isFirefox'])
				$(this.inlinePopup[i]["popup_id"]).onkeydown= keyDown;
			else
				$(this.inlinePopup[i]["popup_id"]).onkeypress= keyDown;
		}
		
		if(this.settings["allow_resize"]=="both" || this.settings["allow_resize"]=="x" || this.settings["allow_resize"]=="y")
			this.allow_resize(true);
		
		parent.editAreaLoader.toggle(this.id, "on");
		
		
		this.change_smooth_selection_mode(editArea.smooth_selection);
		
		this.execCommand("change_highlight", this.settings["start_highlight"]);
		
		
		this.set_font(editArea.settings["font_family"], editArea.settings["font_size"]);
		
		
		children= parent.getChildren(document.body, "", "selec", "none", "all", -1);
		for(var i=0; i<children.length; i++){
			if(this.nav['isIE'])
				children[i].unselectable = true; 
			else
				children[i].onmousedown= function(){return false};
		
		}
		
		if(this.nav['isGecko']){
			this.textarea.spellcheck= this.settings["gecko_spellcheck"];
		}
		
		
		
		
		if( this.nav['isFirefox'] >= '3' )
			this.content_highlight.style.borderLeft= "solid 1px transparent";
		
		if(this.nav['isIE']){
			this.textarea.style.marginTop= "-1px";
		}
		
		
		if(this.nav['isSafari'] ){
			this.editor_area.style.position= "absolute";
			this.textarea.style.marginLeft="-3px";
			this.textarea.style.marginTop="1px";
		}
		
		if( this.nav['isChrome'] ){
			this.editor_area.style.position= "absolute";
			this.textarea.style.marginLeft="0px";
			this.textarea.style.marginTop="0px";
		}
		
		
		parent.editAreaLoader.add_event(this.result, "click", function(e){ if((e.target || e.srcElement)==editArea.result) { editArea.area_select(editArea.textarea.value.length, 0);}  });
		
		if(this.settings['is_multi_files']!=false)
			this.open_file({'id': this.curr_file, 'text': ''});
	
		this.set_wrap_text( this.settings['wrap_text'] );
		
		setTimeout("editArea.focus();editArea.manage_size();editArea.execCommand('EA_load');", 10);		
		
		this.check_undo();
		this.check_line_selection(true);
		this.scroll_to_view();
		
		for(var i in this.plugins){
			if(typeof(this.plugins[i].onload)=="function")
				this.plugins[i].onload();
		}
		if(this.settings['fullscreen']==true)
			this.toggle_full_screen(true);
	
		parent.editAreaLoader.add_event(window, "resize", editArea.update_size);
		parent.editAreaLoader.add_event(parent.window, "resize", editArea.update_size);
		parent.editAreaLoader.add_event(top.window, "resize", editArea.update_size);
		parent.editAreaLoader.add_event(window, "unload", function(){if(editAreas[editArea.id] && editAreas[editArea.id]["displayed"]) editArea.execCommand("EA_unload");});
		
		
		
	};
	
	
	EditArea.prototype.manage_size= function(onlyOneTime){
		if(!editAreas[this.id])
			return false;
		if(editAreas[this.id]["displayed"]==true && this.textareaFocused)
		{
			var resized= false;
			
			
			
			if( this.settings['wrap_text'] )
			{
				
			}
			else
			{
				var area_width= this.textarea.scrollWidth;
				var area_height= this.textarea.scrollHeight;
				if(this.nav['isOpera']){
					area_width=10000; 								
				}
			}
			
			
			
			if(this.textarea.previous_scrollWidth!=area_width)
			{	
				
				this.container.style.width= area_width+"px";
				this.textarea.style.width= area_width+"px";
				this.content_highlight.style.width= area_width+"px";	
				this.textarea.previous_scrollWidth=area_width;
				resized=true;
			}	
			
			
			
			
			var area_height = this.textarea.scrollHeight;
			if(this.nav['isOpera']){
				area_height= this.last_selection['nb_line']*this.lineHeight;
			}
			
			if(this.nav['isGecko'] && this.smooth_selection && this.last_selection["nb_line"])
				area_height= this.last_selection["nb_line"]*this.lineHeight;
			
			if(this.textarea.previous_scrollHeight!=area_height)	
			{	
				this.container.style.height= (area_height+2)+"px";
				this.textarea.style.height= area_height+"px";
				this.content_highlight.style.height= area_height+"px";	
				this.textarea.previous_scrollHeight= area_height;
				resized=true;
			}
		
			
			if(this.last_selection["nb_line"] >= this.line_number)
			{
				var div_line_number="";
				for(i=this.line_number+1; i<this.last_selection["nb_line"]+100; i++)
				{
					div_line_number+=i+"<br />";
					this.line_number++;
				}
				var span= document.createElement("span");
				if(this.nav['isIE'])
					span.unselectable=true;
				span.innerHTML=div_line_number;         
				$("line_number").appendChild(span);       
			}
		
			
			this.textarea.scrollTop="0px";
			this.textarea.scrollLeft="0px";
			if(resized==true){
				this.scroll_to_view();
			}
		}
		if(!onlyOneTime)
			setTimeout("editArea.manage_size();", 100);
	};
	
	EditArea.prototype.add_event = function(obj, name, handler) {
		if (this.nav['isIE']) {
			obj.attachEvent("on" + name, handler);
		} else{
			obj.addEventListener(name, handler, false);
		}
	};
	
	EditArea.prototype.execCommand= function(cmd, param){
		
		for(var i in this.plugins){
			if(typeof(this.plugins[i].execCommand)=="function"){
				if(!this.plugins[i].execCommand(cmd, param))
					return;
			}
		}
		switch(cmd){
			case "save":
				if(this.settings["save_callback"].length>0)
					eval("parent."+this.settings["save_callback"]+"('"+ this.id +"', editArea.textarea.value);");
				break;
			case "load":
				if(this.settings["load_callback"].length>0)
					eval("parent."+this.settings["load_callback"]+"('"+ this.id +"');");
				break;
			case "onchange":
				if(this.settings["change_callback"].length>0)
					eval("parent."+this.settings["change_callback"]+"('"+ this.id +"');");
				break;		
			case "EA_load":
				if(this.settings["EA_load_callback"].length>0)
					eval("parent."+this.settings["EA_load_callback"]+"('"+ this.id +"');");
				break;
			case "EA_unload":
				if(this.settings["EA_unload_callback"].length>0)
					eval("parent."+this.settings["EA_unload_callback"]+"('"+ this.id +"');");
				break;
			case "toggle_on":
				if(this.settings["EA_toggle_on_callback"].length>0)
					eval("parent."+this.settings["EA_toggle_on_callback"]+"('"+ this.id +"');");
				break;
			case "toggle_off":
				if(this.settings["EA_toggle_off_callback"].length>0)
					eval("parent."+this.settings["EA_toggle_off_callback"]+"('"+ this.id +"');");
				break;
			case "re_sync":
				if(!this.do_highlight)
					break;
			case "file_switch_on":
				if(this.settings["EA_file_switch_on_callback"].length>0)
					eval("parent."+this.settings["EA_file_switch_on_callback"]+"(param);");
				break;
			case "file_switch_off":
				if(this.settings["EA_file_switch_off_callback"].length>0)
					eval("parent."+this.settings["EA_file_switch_off_callback"]+"(param);");
				break;
			case "file_close":
				if(this.settings["EA_file_close_callback"].length>0)
					return eval("parent."+this.settings["EA_file_close_callback"]+"(param);");
				break;
			
			default:
				if(typeof(eval("editArea."+cmd))=="function")
				{
					if(this.settings["debug"])
						eval("editArea."+ cmd +"(param);");
					else
						try{eval("editArea."+ cmd +"(param);");}catch(e){};
				}
		}
	};
	
	EditArea.prototype.get_translation= function(word, mode){
		if(mode=="template")
			return parent.editAreaLoader.translate(word, this.settings["language"], mode);
		else
			return parent.editAreaLoader.get_word_translation(word, this.settings["language"]);
	};
	
	EditArea.prototype.add_plugin= function(plug_name, plug_obj){
		for(var i=0; i<this.settings["plugins"].length; i++){
			if(this.settings["plugins"][i]==plug_name){
				this.plugins[plug_name]=plug_obj;
				plug_obj.baseURL=parent.editAreaLoader.baseURL + "plugins/" + plug_name + "/";
				if( typeof(plug_obj.init)=="function" )
					plug_obj.init();
			}
		}
	};
	
	EditArea.prototype.load_css= function(url){
		try{
			link = document.createElement("link");
			link.type = "text/css";
			link.rel= "stylesheet";
			link.media="all";
			link.href = url;
			head = document.getElementsByTagName("head");
			head[0].appendChild(link);
		}catch(e){
			document.write("<link href='"+ url +"' rel='stylesheet' type='text/css' />");
		}
	};
	
	EditArea.prototype.load_script= function(url){
		try{
			script = document.createElement("script");
			script.type = "text/javascript";
			script.src  = url;
			script.charset= "UTF-8";
			head = document.getElementsByTagName("head");
			head[0].appendChild(script);
		}catch(e){
			document.write("<script type='text/javascript' src='" + url + "' charset=\"UTF-8\"><"+"/script>");
		}
	};
	
	
	EditArea.prototype.add_lang= function(language, values){
		if(!parent.editAreaLoader.lang[language])
			parent.editAreaLoader.lang[language]=new Object();
		for(var i in values)
			parent.editAreaLoader.lang[language][i]= values[i];
	};
	
	
	function $(id){return document.getElementById( id );};

	var editArea = new EditArea();	
	editArea.add_event(window, "load", init);
	
	function init(){		
		setTimeout("editArea.init();  ", 10);
	};
