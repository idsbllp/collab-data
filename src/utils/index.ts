import { insertHeading, insertP } from "./dom";

export enum TestType {
  InsertObject = '插入对象',
  InsertList = '插入列表',
  Move = '移动',
  Update = '更新',
  RemoveObject = '删除对象',
  RemoveList = '删除列表',
}

interface TestProps {
  ele: HTMLElement;
  type: TestType,
  fn: (ops: any) => void;
  getOps: (index: number, prevOp: any) => void;
}

const testCount = 4000;

export function addTest(props: TestProps) {
  const { ele, type, fn, getOps } = props;
  insertHeading(ele, `测试${type} ${testCount} 次耗时`, 3);
  let hasError = null;

  let duration = 0;
  try {
    let prevOp = null;
    for (let index = 0; index < testCount; index++) {
      prevOp = getOps(index, prevOp);
    }
    const start = performance.now();
    fn(prevOp);
    const end = performance.now();

    duration = end - start;
  } catch (err) {
    console.error(err);
    hasError = err;
  }
  
  let text;
  if (hasError) {
    text = `${type} 报错了： ${hasError}`;
  } else {
    text = `${type} ${testCount} 次 op 耗时： ${(duration).toFixed(5)}ms`;
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
