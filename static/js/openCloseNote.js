	function openCloseNote(id){
    	display = document.getElementById(id).style.visibility;

    	if(display=='hidden'){
       		document.getElementById(id).style.visibility='unset';
    	}else{
		   document.getElementById(id).style.visibility='hidden';
    	}
	}