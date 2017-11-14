$(function(){
	
	var note = $('#note');
	
	var saveTimer,
		lineHeight = parseInt(note.css('line-height')),
		minHeight = parseInt(note.css('min-height')),
		lastHeight = minHeight,
		newHeight = 0,
		newLines = 0;
		
	var countLinesRegex = new RegExp('\n','g');
	
	// Событие input запускается нажатием клавиш,
	// копированием и даже операциями отмены/повторения.
	
	note.on('input',function(e){
		
		// Очистка таймера предотвращает
		// сохранение каждого нажатия клавиш
		clearTimeout(saveTimer);
		saveTimer = setTimeout(ajaxSaveNote, 2000);
		
		// Подсчет количества новых строк
		newLines = note.val().match(countLinesRegex);
		
		if(!newLines){
			newLines = [];
		}
		
		// Увеличиваем высоту заметки (если нужно)
		newHeight = Math.max((newLines.length + 1)*lineHeight, minHeight);
		
		// Увеличиваем/уменьшаем высоту только один раз при изменеии
		if(newHeight != lastHeight){
			note.height(newHeight);
			lastHeight = newHeight;
		}
	}).trigger('input');	// Данная строка будет изменять размер заметки при загрузке страницы
	
	function ajaxSaveNote(){
		
		// Запускаем запрос AJAX POST для сохранения записи
		$.post('index.php', { 'note' : note.val() });
	}

});
