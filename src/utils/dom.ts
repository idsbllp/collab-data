function insertEle(ele: HTMLElement, text: string, type: string) {
  const hn = document.createElement(type);
  hn.innerText = text;
  ele.appendChild(hn);
}

export function insertHeading(ele: HTMLElement, text: string, level: number) {
  return insertEle(ele, text, `h${level}`);
}

export function insertP(ele: HTMLElement, text: string) {
  return insertEle(ele, text, 'p');
}
