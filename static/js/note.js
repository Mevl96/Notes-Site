$(function () {

	var note = $('#note');

	var saveTimer,
		lineHeight = parseInt(note.css('line-height')),
		minHeight = parseInt(note.css('min-height')),
		lastHeight = minHeight,
		newHeight = 0,
		newLines = 0;

	var countLinesRegex = new RegExp('\n', 'g');

	// Событие input запускается нажатием клавиш,
	// копированием и даже операциями отмены/повторения.

	note.on('input', function (e) {

		// Подсчет количества новых строк
		newLines = note.val().match(countLinesRegex);

		if (!newLines) {
			newLines = [];
		}

		// Увеличиваем высоту заметки (если нужно)
		newHeight = Math.max((newLines.length + 1) * lineHeight, minHeight);

		// Увеличиваем/уменьшаем высоту только один раз при изменеии
		if (newHeight !== lastHeight) {
			note.height(newHeight);
			lastHeight = newHeight;
		}
	}).trigger('input');	// Данная строка будет изменять размер заметки при загрузке страницы


	$('.folder').on('click', 'label', function (e) {
		$('.allFolders').find('input').prop('checked', false);
		$(this).find('input').prop('checked', true);
	});
});

function createCategory() {
	var catName = window.prompt("Category name", "New category");
	$.ajax({
		url: '/ajax/category/new',
		type: 'POST',
		data: {name: catName}
	}).done(function (data) {
		$('.allFolders').first().append('<tr class="folder">' +
			'<td>' +
			'<label for="cat' + data.id + '">' +
			'<input type="radio" id="cat' + data.id + '" value="' + data.id + '">' +
			'<span>' + data.name + '</span>' +
			'</label>' +
			'</td>' +
			'</tr>');
	}).fail(function (e) {
		alert('FAIL');
	});
}

function saveNote() {
	var pad = $('#pad');
	var cat = $('.allFolders').find('input:checked').val();
	$.ajax({
		url: '/ajax/notes/new',
		type: 'POST',
		data: {title: pad.find('#noteTitle').val(), category: cat, content: pad.find('#note').val()}
	}).done(function (data) {
		alert('OK');
	}).fail(function (e) {
		alert('FAIL');
	});
}