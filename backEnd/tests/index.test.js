// Basic smoke test for the Express app
const assert = require('assert');

assert.strictEqual(typeof require('../index'), 'function', 'index.js should export the Express app');
console.log('Smoke test passed');
