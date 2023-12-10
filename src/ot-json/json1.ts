// https://github.com/ottypes/json1

import json1 from 'ot-json1';
import { v4 as uuidv4 } from 'uuid';
import { get } from 'lodash-es';
import { snapshot as snapshotSmall } from './data/ot-snapshot-small';
import { snapshot as snapshotMiddle } from './data/ot-snapshot-middle';
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

const otContainer = document.querySelector('.ot-json') as HTMLElement;

function getTestJSON(blockType: string, index: number) {
  return { type: blockType, id: String(index).repeat(10), map: { [`test_${index}`]: `value_${index}` } }
}

function testInsertObject() {
  addTest({
    ele: otContainer,
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
    ele: otContainer,
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
    ele: otContainer,
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
    ele: otContainer,
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
    ele: otContainer,
    type: TestType.RemoveObject,
    fn: index => {
      const removeOp = json1.removeOp(['object', keys[max - index]]);
      doc = json1.type.apply(doc, removeOp) as Snapshot;
    }
  });

  console.log(`logllp ${TestType.RemoveObject} 后的 doc: `, doc);
}

function testRemoveList() {
  const max = doc.blocks.length - 1;

  addTest({
    ele: otContainer,
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

  insertHeading(otContainer, doc.type, 2);
  testInsertObject();
  testInsertList();
  testMove();
  testUpdate();
  testRemoveObject();
  testRemoveList();
}

test(snapshotSmall);
test(snapshotMiddle);
// test(snapshotMiddle);
// test(snapshotMiddle);
// test(snapshotMiddle);
