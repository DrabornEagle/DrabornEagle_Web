import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.2.2.guard.js');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));
const dkdSw = dkdRead('sw.js');

assert.match(dkdApp, /DKD_WEB_VERSION = '3\.2\.2'/);
assert.match(dkdApp, /dkdBootWebV322/);
assert.match(dkdApp, /v3\.2\.2\.guard\.js/);
assert.doesNotMatch(dkdApp, /v3\.2\.1\.guard\.js/);
assert.match(dkdSw, /draborngate-web-v3\.2\.2-observer-loop-hotfix/);
assert.match(dkdSw, /v3\.2\.2\.guard\.js\?v=3\.2\.2/);
assert.equal(dkdManifest.name, 'DraBornGate Web v3.2.2');
assert.equal(dkdManifest.start_url, '/DraBornGate/?v=3.2.2');
for (const dkdHtml of [dkdIndex, dkdSimpleIndex]) {
  assert.match(dkdHtml, /DraBornGate Web v3\.2\.2/);
  assert.match(dkdHtml, /assets\/app\.js\?v=3\.2\.2/);
}

let dkdObserverCallback = null;
class DkdElement {}
class DkdDocument {}
class DkdDocumentFragment {}
const dkdDocumentElement = new DkdElement();
const dkdContext = {
  window: {},
  sessionStorage: { setItem() {} },
  Node: { TEXT_NODE: 3 },
  NodeFilter: { SHOW_TEXT: 4 },
  Element: DkdElement,
  Document: DkdDocument,
  DocumentFragment: DkdDocumentFragment,
  document: {
    documentElement: dkdDocumentElement,
    createTreeWalker() {
      return { currentNode: null, nextNode() { return false; } };
    },
  },
  MutationObserver: class {
    constructor(dkdCallback) { dkdObserverCallback = dkdCallback; }
    observe() {}
  },
};
vm.runInNewContext(dkdGuard, dkdContext, { filename: 'v3.2.2.guard.js' });
assert.equal(typeof dkdObserverCallback, 'function');

function dkdTrackedNode(dkdInitial) {
  let dkdValue = dkdInitial;
  let dkdWrites = 0;
  return {
    nodeType: 3,
    get nodeValue() { return dkdValue; },
    set nodeValue(dkdNext) { dkdWrites += 1; dkdValue = dkdNext; },
    snapshot() { return { value: dkdValue, writes: dkdWrites }; },
  };
}

const dkdCurrentNode = dkdTrackedNode('DraBornGate Web v3.2.2');
dkdObserverCallback([{ type: 'characterData', target: dkdCurrentNode, addedNodes: [] }]);
assert.deepEqual(dkdCurrentNode.snapshot(), { value: 'DraBornGate Web v3.2.2', writes: 0 });

const dkdOldNode = dkdTrackedNode('DraBornGate Web v3.2.1');
dkdObserverCallback([{ type: 'characterData', target: dkdOldNode, addedNodes: [] }]);
assert.deepEqual(dkdOldNode.snapshot(), { value: 'DraBornGate Web v3.2.2', writes: 1 });
dkdObserverCallback([{ type: 'characterData', target: dkdOldNode, addedNodes: [] }]);
assert.deepEqual(dkdOldNode.snapshot(), { value: 'DraBornGate Web v3.2.2', writes: 1 });

console.log('DraBornGate Web v3.2.2 observer döngüsü, sürüm ve önbellek kontrolleri geçti.');
