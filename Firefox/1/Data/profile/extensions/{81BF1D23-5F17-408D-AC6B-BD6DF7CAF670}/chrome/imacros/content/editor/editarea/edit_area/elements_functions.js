  
	
	
	
	function getAttribute( elm, aname ) {
		try{
			var avalue = elm.getAttribute( aname );
		}catch(exept){
		
		}
		if ( ! avalue ) {
			for ( var i = 0; i < elm.attributes.length; i ++ ) {
				var taName = elm.attributes [i] .name.toLowerCase();
				if ( taName == aname ) {
					avalue = elm.attributes [i] .value;
					return avalue;
				}
			}
		}
		return avalue;
	};
	
	
	function setAttribute( elm, attr, val ) {
		if(attr=="class"){
			elm.setAttribute("className", val);
			elm.setAttribute("class", val);
		}else{
			elm.setAttribute(attr, val);
		}
	};
	
	
	function getChildren(elem, elem_type, elem_attribute, elem_attribute_match, option, depth)
	{           
		if(!option)
			var option="single";
		if(!depth)
			var depth=-1;
		if(elem){
			var children= elem.childNodes;
			var result=null;
			var results= new Array();
			for (var x=0;x<children.length;x++) {
				strTagName = new String(children[x].tagName);
				children_class="?";
				if(strTagName!= "undefined"){
					child_attribute= getAttribute(children[x],elem_attribute);
					if((strTagName.toLowerCase()==elem_type.toLowerCase() || elem_type=="") && (elem_attribute=="" || child_attribute==elem_attribute_match)){
						if(option=="all"){
							results.push(children[x]);
						}else{
							return children[x];
						}
					}
					if(depth!=0){
						result=getChildren(children[x], elem_type, elem_attribute, elem_attribute_match, option, depth-1);
						if(option=="all"){
							if(result.length>0){
								results= results.concat(result);
							}
						}else if(result!=null){                                                                          
							return result;
						}
					}
				}
			}
			if(option=="all")
			   return results;
		}
		return null;
	};       
	
	function isChildOf(elem, parent){
		if(elem){
			if(elem==parent)
				return true;
			while(elem.parentNode != 'undefined'){
				return isChildOf(elem.parentNode, parent);
			}
		}
		return false;
	};
	
	function getMouseX(e){
		
		if(e!=null && typeof(e.pageX)!="undefined"){
			return e.pageX;
		}else{
			return (e!=null?e.x:event.x)+ document.documentElement.scrollLeft;
		}
		
	};
	
	function getMouseY(e){
		
		if(e!=null && typeof(e.pageY)!="undefined"){
			return e.pageY;
		}else{
			return (e!=null?e.y:event.y)+ document.documentElement.scrollTop;
		}
		
	};
	
	function calculeOffsetLeft(r){
	  return calculeOffset(r,"offsetLeft")
	};
	
	function calculeOffsetTop(r){
	  return calculeOffset(r,"offsetTop")
	};
	
	function calculeOffset(element,attr){
	  var offset=0;
	  while(element){
		offset+=element[attr];
		element=element.offsetParent
	  }
	  return offset;
	};
	
	
	function get_css_property(elem, prop)
	{
		if(document.defaultView)
		{
			return document.defaultView.getComputedStyle(elem, null).getPropertyValue(prop);
		}
		else if(elem.currentStyle)
		{
			var prop = prop.replace(/-\D/gi, function(sMatch)
			{
				return sMatch.charAt(sMatch.length - 1).toUpperCase();
			});
			return elem.currentStyle[prop];
		}
		else return null;
	}
	
  
	
	var move_current_element;
	
	function start_move_element(e, id, frame){
		var elem_id=(e.target || e.srcElement).id;
		if(id)
			elem_id=id;		
		if(!frame)
			frame=window;
		if(frame.event)
			e=frame.event;
			
		move_current_element= frame.document.getElementById(elem_id);
		move_current_element.frame=frame;
		frame.document.onmousemove= move_element;
		frame.document.onmouseup= end_move_element;
		
		
		
		
		mouse_x= getMouseX(e);
		mouse_y= getMouseY(e);
		
		move_current_element.start_pos_x = mouse_x - (move_current_element.style.left.replace("px","") || calculeOffsetLeft(move_current_element));
		move_current_element.start_pos_y = mouse_y - (move_current_element.style.top.replace("px","") || calculeOffsetTop(move_current_element));
		return false;
	};
	
	function end_move_element(e){
		move_current_element.frame.document.onmousemove= "";
		move_current_element.frame.document.onmouseup= "";		
		move_current_element=null;
	};
	
	function move_element(e){
		
		if(move_current_element.frame && move_current_element.frame.event)
			e=move_current_element.frame.event;
		var mouse_x=getMouseX(e);
		var mouse_y=getMouseY(e);
		var new_top= mouse_y - move_current_element.start_pos_y;
		var new_left= mouse_x - move_current_element.start_pos_x;
		
		var max_left= move_current_element.frame.document.body.offsetWidth- move_current_element.offsetWidth;
		max_top= move_current_element.frame.document.body.offsetHeight- move_current_element.offsetHeight;
		new_top= Math.min(Math.max(0, new_top), max_top);
		new_left= Math.min(Math.max(0, new_left), max_left);
		
		move_current_element.style.top= new_top+"px";
		move_current_element.style.left= new_left+"px";		
		return false;
	};
	
 
	
	var nav= editAreaLoader.nav;
	
	
	function getSelectionRange(textarea){
		
		
		return {"start": textarea.selectionStart, "end": textarea.selectionEnd};
	};
	
	
	function setSelectionRange(textarea, start, end){
		textarea.focus();
		
		start= Math.max(0, Math.min(textarea.value.length, start));
		end= Math.max(start, Math.min(textarea.value.length, end));
	
		if(nav['isOpera']){	
			textarea.selectionEnd = 1;	
			textarea.selectionStart = 0;			
			textarea.selectionEnd = 1;	
			textarea.selectionStart = 0;		
		}
		textarea.selectionStart = start;
		textarea.selectionEnd = end;		
		
		
		if(nav['isIE'])
			set_IE_selection(textarea);
	};

	
	
	function get_IE_selection(textarea){
			
		if(textarea && textarea.focused)
		{	
			if(!textarea.ea_line_height)
			{	
				var div= document.createElement("div");
				div.style.fontFamily= get_css_property(textarea, "font-family");
				div.style.fontSize= get_css_property(textarea, "font-size");
				div.style.visibility= "hidden";			
				div.innerHTML="0";
				document.body.appendChild(div);
				textarea.ea_line_height= div.offsetHeight;
				document.body.removeChild(div);
			}
			
			var range = document.selection.createRange();	
			var stored_range = range.duplicate();
			stored_range.moveToElementText( textarea );
			stored_range.setEndPoint( 'EndToEnd', range );
			if(stored_range.parentElement()==textarea){
				
				var elem= textarea;
				var scrollTop= 0;
				while(elem.parentNode){
					scrollTop+= elem.scrollTop;
					elem= elem.parentNode;
				}
			
			
				
			
				var relative_top= range.offsetTop - calculeOffsetTop(textarea)+ scrollTop;
			
				var line_start = Math.round((relative_top / textarea.ea_line_height) +1);
				
				var line_nb= Math.round(range.boundingHeight / textarea.ea_line_height);
				
		
				var range_start= stored_range.text.length - range.text.length;
				var tab= textarea.value.substr(0, range_start).split("\n");			
				range_start+= (line_start - tab.length)*2;		
				textarea.selectionStart = range_start;
				
				var range_end= textarea.selectionStart + range.text.length;
				tab= textarea.value.substr(0, range_start + range.text.length).split("\n");			
				range_end+= (line_start + line_nb - 1 - tab.length)*2;
				textarea.selectionEnd = range_end;
			}
		}
		setTimeout("get_IE_selection(document.getElementById('"+ textarea.id +"'));", 50);
	};
	
	function IE_textarea_focus(){
		event.srcElement.focused= true;
	}
	
	function IE_textarea_blur(){
		event.srcElement.focused= false;
	}
	
	
	function set_IE_selection(textarea){
		if(!window.closed){ 
			var nbLineStart=textarea.value.substr(0, textarea.selectionStart).split("\n").length - 1;
			var nbLineEnd=textarea.value.substr(0, textarea.selectionEnd).split("\n").length - 1;
			var range = document.selection.createRange();
			range.moveToElementText( textarea );
			range.setEndPoint( 'EndToStart', range );
			range.moveStart('character', textarea.selectionStart - nbLineStart);
			range.moveEnd('character', textarea.selectionEnd - nbLineEnd - (textarea.selectionStart - nbLineStart)  );
			range.select();
		}
	};
	
	
	editAreaLoader.waiting_loading["elements_functions.js"]= "loaded";
