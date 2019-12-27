export function getFib(n) {
  const stack = [];
  if (n < 3) {
    return 1;
  }
  stack.push(1);
  stack.push(1);
  let i = 3;
  while (i < n) {
    const tmp1 = stack.pop();
    const tmp2 = stack.pop();
    stack.push(tmp2);
    stack.push(tmp1);
    stack.push(tmp1 + tmp2);
    i++;
  }
  return stack.pop() + stack.pop();
}
