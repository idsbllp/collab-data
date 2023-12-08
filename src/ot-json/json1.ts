// https://github.com/ottypes/json1

import json1 from 'ot-json1';
import { snapshot as OtSnapshot } from './data/ot-snapshot-simple';

console.log('ot json 1 ===================== 开始');
const doc = OtSnapshot;
(window as any).json1 = json1;
(window as any).doc = doc;

const insertOp = json1.insertOp(['blocks', 0, 'key'], 'value');
const doc1 = json1.type.apply(doc, insertOp);
console.log('insert: ', doc1);

console.log('before: ', doc);
const moveOp = json1.moveOp(['blocks', 0, 'children', 1], ['blocks', 0, 'map', 'id1', 'children', 0]);
const doc2 = json1.type.apply(doc, moveOp);
console.log('move: ', doc2);
console.log('ot json 1 ===================== 结束');
