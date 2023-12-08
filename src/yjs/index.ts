import * as Y from 'yjs';

function onSync(doc1: Y.Doc, doc2: Y.Doc) {
  console.log('\n同步前的两个文档');
  console.log('doc1:', doc1.getArray('shared_array').toArray());
  console.log('doc2:', doc2.getArray('shared_array').toArray());

  // 将 doc1 的状态转换为更新，并应用于 doc2
  const update1 = Y.encodeStateAsUpdate(doc1);
  Y.applyUpdate(doc2, update1);

  // 将 doc2 的状态转换为更新，并应用于 doc1
  const update2 = Y.encodeStateAsUpdate(doc2);
  Y.applyUpdate(doc1, update2);

  // 检查同步后两个文档的状态
  console.log('\n同步后的两个文档');
  console.log('doc1:', doc1.getArray('shared_array').toArray());
  console.log('doc2:', doc2.getArray('shared_array').toArray());
}

// 创建两个 Yjs 文档 (doc1 和 doc2)
const doc1 = new Y.Doc();
const sharedArray1 = doc1.getArray('shared_array');
sharedArray1.insert(0, ['A']);

const doc2 = new Y.Doc();
const sharedArray2 = doc2.getArray('shared_array');
sharedArray2.insert(0, ['B']);

// 将两个文档同步前的状态打印
onSync(doc1, doc2);

// 添加新元素到 doc1
sharedArray1.insert(1, ['C']);

// 为了模拟并发更新，同时将新元素添加到 doc2
sharedArray2.insert(1, ['D']);

// 将两个文档的并发更改同步并打印状态
onSync(doc2, doc1);

(window as any).doc1 = doc1;
(window as any).doc2 = doc2;

console.log('update: ',Y.decodeUpdate(Y.encodeStateAsUpdate(doc1)));

const testDoc= new Y.Doc();
const testText=testDoc.getText();
testText.insert(0,'test1');
testText.delete(2, 1);
console.log('update: ',Y.decodeUpdate(Y.encodeStateAsUpdate(testDoc)));


export {};
