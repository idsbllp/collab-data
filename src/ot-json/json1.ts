// https://github.com/ottypes/json1

import json1 from 'ot-json1';
import { v4 as uuidv4 } from 'uuid';
import { get } from 'lodash-es';
import { snapshot as snapshotSmall } from './data/ot-snapshot-small';
import { snapshot as snapshotMiddle } from './data/ot-snapshot-middle';
import { snapshot as snapshotBig } from './data/ot-snapshot-big';
import { insertHeading } from 'src/utils/dom';
import { TestType, addTest, getRandom } from 'src/utils';

type Snapshot = {
  type: string;
  object: Record<string, any>,
  blocks: {
    type: string;
    id: string;
    [key: string]: any;
  }[];
}

let doc = {} as Snapshot;

const container = document.querySelector('.ot-json') as HTMLElement;

function getTestJSON(blockType: string, index: number) {
  return { type: blockType, id: String(index).repeat(10), map: { [`test_${index}`]: `value_${index}` } }
}

function testInsertObject() {
  addTest({
    ele: container,
    type: TestType.InsertObject,
    fn: index => {
      const insertOp = json1.insertOp(['object', uuidv4()], { [`test_${index}`]: `value_${index}` });
      doc = json1.type.apply(doc, insertOp) as Snapshot;
    }
  });

  console.log(`logllp ${TestType.InsertObject} 后的 doc: `, doc);
}

function testInsertList() {
  const blockLength = doc.blocks.length;
  addTest({
    ele: container,
    type: TestType.InsertList,
    fn: index => {
      const insertOp = json1.insertOp(['blocks', blockLength + index], getTestJSON('text', index));
      doc = json1.type.apply(doc, insertOp) as Snapshot;
    }
  });
  console.log(`logllp ${TestType.InsertList} 后的 doc: `, doc);
}

function testMove() {
  const max = doc.blocks.length - 1;
  addTest({
    ele: container,
    type: TestType.Move,
    fn: () => {
      const from = getRandom(max);
      const to = getRandom(max, from);
      const moveOp = json1.moveOp(['blocks', from], ['blocks', to]);
      doc = json1.type.apply(doc, moveOp) as Snapshot;
    }
  });

  console.log(`logllp ${TestType.Move} 后的 doc: `, doc);
}

function testUpdate() {
  const max = doc.blocks.length - 1;
  addTest({
    ele: container,
    type: TestType.Update,
    fn: () => {
      const index = getRandom(max);

      const path = ['blocks', index];
      const replaceOp = json1.replaceOp(path, get(doc, path), getTestJSON('heading', index));
      doc = json1.type.apply(doc, replaceOp) as Snapshot;
    }
  });

  console.log(`logllp ${TestType.Update} 后的 doc: `, doc);
}

function testRemoveObject() {
  const keys = Object.keys(doc.object);
  const max = keys.length - 1;

  addTest({
    ele: container,
    type: TestType.RemoveObject,
    fn: index => {
      const removeOp = json1.removeOp(['object', keys[max - index]]);
      doc = json1.type.apply(doc, removeOp) as Snapshot;
    }
  });

  console.log(`logllp ${TestType.RemoveObject} 后的 doc: `, doc);
}

function testInsertBigObject(object: Record<string, any>) {
  addTest({
    ele: container,
    type: TestType.InsertBigObject,
    once: () => {
      const insertOp = json1.insertOp(['bigObject'], object);
      doc = json1.type.apply(doc, insertOp) as Snapshot;
    }
  });

  console.log(`logllp ${TestType.InsertBigObject} 后的 doc: `, doc);
}

function testRemoveBigObject() {
  addTest({
    ele: container,
    type: TestType.RemoveBigObject,
    once: () => {
      const removeOp = json1.removeOp(['bigObject']);
      doc = json1.type.apply(doc, removeOp) as Snapshot;
    }
  });

  console.log(`logllp ${TestType.RemoveBigObject} 后的 doc: `, doc);
}

function testInsertBigList(list: Record<string, any>[]) {
  addTest({
    ele: container,
    type: TestType.InsertBigList,
    once: () => {
      const insertOp = json1.insertOp(['bigBlocks'], list);
      doc = json1.type.apply(doc, insertOp) as Snapshot;
    }
  });

  console.log(`logllp ${TestType.InsertBigList} 后的 doc: `, doc);
}

function testRemoveBigList() {
  addTest({
    ele: container,
    type: TestType.RemoveBigList,
    once: () => {
      const removeOp = json1.removeOp(['bigBlocks']);
      doc = json1.type.apply(doc, removeOp) as Snapshot;
    }
  });

  console.log(`logllp ${TestType.RemoveBigList} 后的 doc: `, doc);
}

function testRemoveList() {
  const max = doc.blocks.length - 1;

  addTest({
    ele: container,
    type: TestType.RemoveList,
    fn: index => {
      const removeOp = json1.removeOp(['blocks', max - index]);
      doc = json1.type.apply(doc, removeOp) as Snapshot;
    }
  });

  console.log(`logllp ${TestType.RemoveList} 后的 doc: `, doc);
}

function test(snapshot: Snapshot) {
  doc = snapshot;

  insertHeading(container, doc.type, 2);
  testInsertObject();
  testInsertList();
  const object = doc.object;
  const list = doc.blocks;
  testMove();
  testUpdate();

  testInsertBigObject(object);
  testRemoveBigObject();

  testInsertBigList(list);
  testRemoveBigList();

  testRemoveObject();
  testRemoveList();
}

console.log('ot json 1 ===================== 开始');

test(snapshotSmall);
console.log('ot json 1 ===================== 分隔符');
test(snapshotMiddle);
console.log('ot json 1 ===================== 分隔符');
test(snapshotBig);
console.log('ot json 1 ===================== 结束');
