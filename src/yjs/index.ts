import * as Y from 'yjs';

import { v4 as uuidv4 } from 'uuid';
import { insertHeading } from 'src/utils/dom';
import { TestType, addTest, getRandom } from 'src/utils';

import { initDoc as initDocSmall } from './data/small';

let doc = initDocSmall();

const container = document.querySelector('.yjs') as HTMLElement;

function getTestJSON(blockType: string, index: number) {
  return { type: blockType, id: String(index).repeat(10), map: { [`test_${index}`]: `value_${index}` } }
}

function testInsertObject() {
  addTest({
    ele: container,
    type: TestType.InsertObject,
    fn: index => {
      const object = doc.getMap('map').get('object') as Y.Map<any>;
      object.set(uuidv4(), { [`test_${index}`]: `value_${index}` });
    }
  });

  console.log(`logllp ${TestType.InsertObject} 后的 doc: `, doc.getMap('map').toJSON());
}

function testInsertList() {
  addTest({
    ele: container,
    type: TestType.InsertList,
    fn: index => {
      const array = doc.getMap('map').get('array') as Y.Array<any>;
      array.push([getTestJSON('text', index)]);
    }
  });
  console.log(`logllp ${TestType.InsertList} 后的 doc: `, doc.getMap('map').toJSON());
}

function testMove() {
  const array = doc.getMap('map').get('array') as Y.Array<any>;
  const max = array.length - 1;

  addTest({
    ele: container,
    type: TestType.Move,
    fn: () => {
      const from = getRandom(max);
      const to = getRandom(max, from);

      const item = array.get(from);
      array.delete(from);
      array.insert(to, [item]);
    }
  });

  console.log(`logllp ${TestType.Move} 后的 doc: `, doc);
}

function testUpdate() {
  const array = doc.getMap('map').get('array') as Y.Array<any>;
  const max = array.length - 1;

  addTest({
    ele: container,
    type: TestType.Update,
    fn: index => {
      const from = getRandom(max);
      const to = getRandom(max, from);

      array.delete(from);
      array.insert(to, [getTestJSON('heading', index)]);
    }
  });

  console.log(`logllp ${TestType.Update} 后的 doc: `, doc.getMap('map').toJSON());
}

function testRemoveObject() {
  const object = doc.getMap('map').get('object') as Y.Map<any>;
  const keys = object.keys();

  addTest({
    ele: container,
    type: TestType.RemoveObject,
    fn: index => {
      const key = keys.next().value;
      object.delete(key);
    }
  });

  console.log(`logllp ${TestType.RemoveObject} 后的 doc: `, doc.getMap('map').toJSON());
}

function testRemoveList() {
  const array = doc.getMap('map').get('array') as Y.Array<any>;
  const max = array.length - 1;

  addTest({
    ele: container,
    type: TestType.RemoveList,
    fn: index => {
      array.delete(max - index);
    }
  });

  console.log(`logllp ${TestType.RemoveList} 后的 doc: `, doc.getMap('map').toJSON());
}

function test(doc: Y.Doc) {
  insertHeading(container, doc.getMap('map').get('type') as string, 2);
  testInsertObject();
  testInsertList();
  testMove();
  testUpdate();
  testRemoveObject();
  testRemoveList();
}

console.log('ot yjs ===================== 开始');

test(doc);
// test(snapshotMiddle);
// test(snapshotMiddle);
// test(snapshotMiddle);
// test(snapshotMiddle);
console.log('ot yjs ===================== 结束');