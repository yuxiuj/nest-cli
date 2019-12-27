// 移除空白+小写修正
export function trimString(str) {
  if (!str) {
    return '';
  }
  return str
    .toString()
    .replace(/\s+/g, '')
    .toLowerCase();
}

// 随机挑选答案
export function pickAnswer(str, separator = '|') {
  if (!str) {
    return '';
  }
  const list = str.split(separator);
  return list[Math.floor(Math.random() * list.length)];
}
