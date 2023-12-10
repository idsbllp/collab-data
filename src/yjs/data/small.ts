import * as Y from 'yjs';

export function initDoc() {
  const doc = new Y.Doc();
  const map = doc.getMap('map');

  map.set('type', '空文档');
  map.set('array', new Y.Array());
  map.set('object', new Y.Map());

  return doc;
}
