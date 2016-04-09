# Urrt.js

Reader for Medium.

## Use

Run `urrt.js` in your web console. I know this is stupid, but Medium used Content-Security-Policy header to prevent this code being run on their site. I'm looking for ways to solve this.

## Extensibility

The `selector` and the `wordPersistDuration` are configurable via localStorage.

```javascript
// Set word-per-min to 456
localStorage['JN--urrt.config.wordPersistDuration'] = 60/456;

// Set selector
localStorage['JN--urrt.config.selector'] = '__ p, __ blockquote, __ h1, __ h2, __ h3'.replace(/__/g, '.article-content');
```

## License

MIT License.
