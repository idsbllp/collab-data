import { insertHeading, insertP } from "./dom";

export enum TestType {
  InsertBigObject = '插入大对象',
  InsertObject = '插入多次对象',
  InsertBigList = '插入大列表',
  InsertList = '插入多次列表',
  Move = '移动',
  Update = '更新',
  RemoveBigObject = '删除大对象',
  RemoveObject = '删除多次对象',
  RemoveBigList = '删除大列表',
  RemoveList = '删除列表',
}

interface TestProps {
  ele: HTMLElement;
  type: TestType,
  fn?: (index: number) => void;
  once?: () => void;
}

const testCount = 4000;

export function addTest(props: TestProps) {
  const { ele, type, fn, once } = props;
  insertHeading(ele, `测试${type} ${testCount}  ${once ? '条数据' : '次'} 耗时`, 3);
  let hasError = null;

  const start = performance.now();
  if (once) {
    once();
  } else if (fn) {
    for (let index = 0; index < testCount; index++) {
      try {
        fn(index);
      } catch (err) {
        console.error(index, err);
        console.error(index, err);
        console.error(index, err);
        hasError = err;
      }
    }
  }
  const end = performance.now();

  let text;
  if (hasError) {
    text = `${type} 报错了： ${hasError}`;
  } else {
    text = `${type} ${testCount} ${once ? '条条数据' : '次'} op 耗时： ${(end - start).toFixed(5)}ms`;
  }
  insertP(ele, text);
}

export function getRandom(max: number, exclude = -1) {
  const random = Math.ceil(Math.random() * max);
  if (random !== exclude) {
    return random;
  }

  return getRandom(max, exclude);
}
