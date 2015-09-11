var urrt = {
	'_currentReadingElementIndex': 0,
	'config': {
		'_wordPersistDuration': 60/370
	}
};

urrt.findAndParseAllReadableElements = function () {
	var elements = document.querySelectorAll('h1, h2, h3, h4, h5, p, blockquote');
	var parsedElements = [];
	for (var i = 0; i < elements.length; i++) {
		var _tagName = elements[i].tagName.toLowerCase();
		var _words = elements[i].innerText.trim().split(' ');
		for (var j = 0; j < _words.length; j++) {
			parsedElements.push({
				tagName: _tagName,
				word: _words[j]
			});
		};

	};
	return parsedElements;
};

urrt.initReaderView = function () {
	var _readerView = document.createElement('div');
	_readerView.innerHTML = '';
	_readerView.setAttribute('id', 'urrt-reader-view');
	_readerView.setAttribute('data-tag-name', 'p');

	// Give reader vieww styles
	_readerView.style.fontFamily = '"Myriad Pro", "Helvetica Neue", Helvetica, Arial, "Hiragino Sans GB", sans-serif';
	_readerView.style.color = '#000';
	_readerView.style.textAlign = 'center';
	_readerView.style.background = '#FFF';
	_readerView.style.boxShadow = 'rgba(0, 0, 0, 0.3) 0 1px 3px';
	_readerView.style.position = 'fixed';
	_readerView.style.zIndex = '99999';
	_readerView.style.top = '0';
	_readerView.style.left = '0';
	_readerView.style.width = '100vw';
	_readerView.style.height = '100vh';
	_readerView.style.paddingTop = '30vh';
	_readerView.style.boxSizing = 'border-box';

	// Specify CSS
	var css = document.createElement('style');
	css.innerHTML = [
		'#urrt-reader-view[data-tag-name="h1"] { font-size: 94px; font-weight: 600; }',
		'#urrt-reader-view[data-tag-name="h2"] { font-size: 89px; font-weight: 600; }',
		'#urrt-reader-view[data-tag-name="h3"] { font-size: 84px; font-weight: 600; }',
		'#urrt-reader-view[data-tag-name="h4"] { font-size: 79px; font-weight: 600; }',
		'#urrt-reader-view[data-tag-name="h5"] { font-size: 74px; font-weight: 600; }',
		'#urrt-reader-view[data-tag-name="h6"] { font-size: 62px; font-weight: 400; }',
		'#urrt-reader-view[data-tag-name="p"] { font-size: 60px; font-weight: 300; }',
		'#urrt-reader-view[data-tag-name="blockquote"] { font-size: 60px; font-weight: 300; font-style: italic; }'
	].join('');
	document.head.appendChild(css);

	// Put into document tree
	document.body.appendChild(_readerView);
};

urrt.go = function () {
	urrt.initReaderView();

	var parsedElements = urrt.findAndParseAllReadableElements();
	urrt.updatingService = window.setInterval(function(){
		var _word = parsedElements[urrt._currentReadingElementIndex].word;
		var _tagName = parsedElements[urrt._currentReadingElementIndex].tagName;

		var _highlightChar = function (position) {
			var _tmpWord = _word.slice(0, position) + '<span style="color: red;">' + _word.slice(position, position + 1) + '</span>' + _word.slice(position + 1)
			return _tmpWord;
		};
		if (3 < _word.length < 6) {
			_word = _highlightChar(1);
		} else if (5 < _word.length < 9) {
			_word = _highlightChar(3);
		} else if (8 < _word.length < 11) {
			_word = _highlightChar(4);
		} else if (10 < _word.length < 15) {
			_word = _highlightChar(6);
		} else if (14 < _word.length) {
			_word = _highlightChar(7);
		};

		if (_tagName == 'blockquote') {
			_word = '<span style="color: #CCC; margin-right: 20px;">“</span><span style="border-bottom: 2px solid #EEE; padding-bottom: 8px;">' + _word + '</span><span style="color: #CCC; margin-left: 20px;">”</span>';
		};
		document.getElementById('urrt-reader-view').setAttribute('data-tag-name', _tagName);
		document.getElementById('urrt-reader-view').innerHTML = _word;
		urrt._currentReadingElementIndex += 1;
		if (urrt._currentReadingElementIndex >= parsedElements.length) {
			window.clearInterval(urrt.updatingService);
		};
	}, urrt.config._wordPersistDuration*1000);
};

urrt.go();
