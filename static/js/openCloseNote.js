function openCloseNote(id, buttonId){
	var note = $(id);
	var button = $(buttonId);
	if(note.css('display') !== 'none') {
		button.fadeOut();
		note.fadeOut();
	} else {
		button.fadeIn();
		note.fadeIn();
	}
}