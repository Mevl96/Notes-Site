function snackbar(message) {
	var bar = $('#snackbar');
	bar.empty().append(message);
	bar.addClass('show');
	setTimeout(function () {
		bar.removeClass('show');
	}, 3000);
}


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
		snackbar('Error');
	});
}

function saveNote() {
	var pad = $('#pad');
	var nid = parseInt(pad.find('#nid').val());
	if (nid === -1) {
		var cat = $('.allFolders').find('input:checked').val();
		$.ajax({
			url: '/ajax/notes/new',
			type: 'POST',
			data: {title: pad.find('#noteTitle').val(), category: cat, content: pad.find('#note').val()}
		}).done(function (data) {
			$('#nid').val(data.id);
			$('#f' + cat).after('<tr class="note" id="n' + data.id + '">' +
				'<td><a href="javascript:openNote(' + data.id + ');">' + pad.find('#noteTitle').val() + '</a>' +
				'</td></tr>');
			snackbar('Note successfully created');
		}).fail(function (e) {
			snackbar('Error');
		});
	} else {
		$.ajax({
			url: '/ajax/notes/' + nid,
			type: 'POST',
			data: {title: pad.find('#noteTitle').val(), content: pad.find('#note').val()}
		}).done(function (data) {
			snackbar('Note successfully saved');
		}).fail(function (e) {
			snackbar('Error');
		});
	}
}

function openNote(nid) {
	var note = $('#pad');
	var button = $('#buttonAddDiv');
	if (note.css('display') !== 'none') {
		button.hide();
		note.hide();
	}
	$.ajax({
		url: '/ajax/notes/' + nid,
		type: 'GET'
	}).done(function (data) {
		note.find('textarea').val(data.content);
		note.find('#noteTitle').val(data.title);
		note.find('#nid').val(data.id);
		button.fadeIn();
		note.fadeIn();
	}).fail(function (e) {
		snackbar('Error');
	});
}

function newNote() {
	var note = $('#pad');
	var button = $('#buttonAddDiv');
	if (note.css('display') !== 'none') {
		button.hide();
		note.hide();
	}
	note.find('textarea').val('');
	note.find('#noteTitle').val('New note');
	note.find('#nid').val(-1);
	button.fadeIn();
	note.fadeIn();
}

function trash() {
	var pad = $('#pad');
	var button = $('#buttonAddDiv');
	var nid = parseInt(pad.find('#nid').val());
	if (nid === -1) {
		button.fadeOut();
		pad.fadeOut();
		snackbar('Note successfully deleted');
		return
	}
	$.ajax({
		url: '/ajax/notes/' + nid,
		type: 'DELETE'
	}).done(function (data) {
		if (data.result) {
			button.fadeOut();
			pad.fadeOut();
			$('#n'+nid).remove();
			snackbar('Note successfully deleted');
		} else {
			snackbar('Error');
		}
	}).fail(function (e) {
		snackbar('Error');
	});

}