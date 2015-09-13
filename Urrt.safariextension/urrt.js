var urrt = {
	'_currentReadingElementIndex': 0,
	'config': {
		'_wordPersistDuration': 60/470,
		'_seperationLineManipulation': 3,
		'_sentenceEndManipulation': 3
	}
};

urrt.findAndParseAllReadableElements = function () {
	Array.prototype.manipulate = function (times) {
		for (var i = 0; i < times; i++) {
			this.push(this[0]);
		};
	};
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
			if (_words[j].charAt(_words[j].length-1).match(/(\.|\?|!)/g)) {
				for (var k = 0; k < urrt.config._sentenceEndManipulation; k++) {
					parsedElements.push({
						tagName: _tagName,
						word: _words[j]
					});
				};
			};
		};
		for (var j = 0; j < urrt.config._seperationLineManipulation; j++) {
			parsedElements.push({
				tagName: 'p',
				word: '* * * * * * *'
			});
		}
	};
	return parsedElements;
};

urrt.initReaderView = function () {
	var _readerView = document.createElement('div');
	_readerView.innerHTML = '<div class="urrt-time-count--container"><div class="urrt-time-count">WPM<div id="urrt-reader-view--wpm--inner" class="urrt-time-count--inner">***</div></div><div class="urrt-time-count">Remaining<div id="urrt-reader-view--time-remaining--inner" class="urrt-time-count--inner">**:**</div></div><div class="urrt-time-count">Duration<div id="urrt-reader-view--time-eta--inner" class="urrt-time-count--inner">**:**</div></div><div class="urrt-time-count">Progress<div id="urrt-reader-view--time-percentage--inner" class="urrt-time-count--inner">*%</div></div></div><div id="urrt-reader-view--progress-bar"><div id="urrt-reader-view--progress-bar--inner"></div></div><div id="urrt-reader-view--content"></div>';
	_readerView.setAttribute('id', 'urrt-reader-view');
	_readerView.setAttribute('data-tag-name', 'p');

	// Specify CSS
	var css = document.createElement('style');
	css.innerHTML = [
		'#urrt-reader-view {',
			'font-family: "Helvetica Neue", Helvetica, Arial, "Hiragino Sans GB", sans-serif;',
			'color: #000;',
			'text-align: center;',
			'background: rgba(255, 255, 255, 1);',
			'position: fixed;',
			'z-index: 99999;',
			'top: 0;',
			'left: 0;',
			'box-sizing: border-box;',
			'width: 100vw;',
			'height: 100vh;',
		'}',
		'.urrt-time-count--container { position: fixed; top: 30px; left: 10px; text-align: center; width: 100vw; }',
		'.urrt-time-count { font-size: 16px; color: #999; display: inline-block; padding: 0 25px 0; text-transform: lowercase; }',
		'.urrt-time-count--inner { font-size: 28px; color: #666; display: block; }',
		'#urrt-reader-view--progress-bar { position: fixed; top: 0; left: 0; width: 100vw; height: 10px; }',
		'#urrt-reader-view--progress-bar--inner { background: #0895D5; width: 1px; height: 10px; -webkit-transition: all _DELAY_ms ease; transition: all _DELAY_ms ease;}'.replace(/_DELAY_/g, urrt.config._wordPersistDuration*1000),
		'#urrt-reader-view--content { letter-spacing: 0.12rem; padding-top: 29vh; }',
		'#urrt-reader-view[data-tag-name="h1"] #urrt-reader-view--content { font-size: 94px; font-weight: 600; }',
		'#urrt-reader-view[data-tag-name="h2"] #urrt-reader-view--content { font-size: 89px; font-weight: 600; }',
		'#urrt-reader-view[data-tag-name="h3"] #urrt-reader-view--content { font-size: 84px; font-weight: 600; }',
		'#urrt-reader-view[data-tag-name="h4"] #urrt-reader-view--content { font-size: 79px; font-weight: 600; }',
		'#urrt-reader-view[data-tag-name="h5"] #urrt-reader-view--content { font-size: 74px; font-weight: 600; }',
		'#urrt-reader-view[data-tag-name="h6"] #urrt-reader-view--content { font-size: 62px; font-weight: 400; }',
		'#urrt-reader-view[data-tag-name="p"] #urrt-reader-view--content { font-size: 60px; font-weight: 300; }',
		'#urrt-reader-view[data-tag-name="blockquote"] #urrt-reader-view--content { font-size: 60px; font-weight: 300; font-style: italic; }'
	].join('');
	document.head.appendChild(css);

	// Put into document tree
	document.body.appendChild(_readerView);
};

urrt.go = function () {
	urrt.initReaderView();

	var parsedElements = urrt.findAndParseAllReadableElements();

	var _convertTimeIntoMinAndSec = function (_input) {
		var _total = Math.round(_input);
		var _min = Math.floor(_total/60);
		var _sec = Math.floor(_total%60);
		_sec = _sec.toString().length == 1 ? '0' + _sec.toString() : _sec.toString();
		return (_min + ':' + _sec);
	};

	// Calculate word-per-min
	document.getElementById('urrt-reader-view--wpm--inner').innerHTML = Math.round(60/urrt.config._wordPersistDuration);

	// Calculate ETA
	document.getElementById('urrt-reader-view--time-eta--inner').innerHTML = _convertTimeIntoMinAndSec( urrt.config._wordPersistDuration * parsedElements.length );

	urrt.updatingService = window.setInterval(function(){
		// Move progress bar
		document.getElementById('urrt-reader-view--progress-bar--inner').style.width = (urrt._currentReadingElementIndex/parsedElements.length*100) + '%';

		// Update remaining time
		document.getElementById('urrt-reader-view--time-remaining--inner').innerHTML = _convertTimeIntoMinAndSec(urrt.config._wordPersistDuration * parsedElements.length - urrt._currentReadingElementIndex * urrt.config._wordPersistDuration);

		// Update progress percentage
		document.getElementById('urrt-reader-view--time-percentage--inner').innerHTML = (urrt._currentReadingElementIndex/parsedElements.length*100) == 100 ? ( '100%' ) : ( Math.floor(urrt._currentReadingElementIndex/parsedElements.length*100) + '%');

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
		document.getElementById('urrt-reader-view--content').innerHTML = _word;
		urrt._currentReadingElementIndex += 1;
		if (urrt._currentReadingElementIndex >= parsedElements.length) {
			window.clearInterval(urrt.updatingService);
		};
	}, urrt.config._wordPersistDuration*1000);
};

urrt.go();
