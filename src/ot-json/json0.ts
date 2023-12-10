// https://github.com/ottypes/json0

// @ts-expect-error
import json0 from 'ot-json0';
import { snapshot as OtSnapshot } from './data/ot-snapshot-small';

console.log('ot json 0 ===================== 开始');

const doc = OtSnapshot;
(window as any).json0 = json0;
(window as any).doc = doc;

console.log('before: ',doc)
const moveOp = {
  p: ['blocks', 0, 'children', 1],
  lm: ['blocks', 0, 'map', 'id1', 'children', 0]
};
const doc2 = json0.type.apply(doc, [moveOp]);
console.log('move: ', doc2);
console.log('ot json 0 ===================== 结束');
