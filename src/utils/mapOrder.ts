export function mapOrder<T extends unknown[]>(
  oldArray: any[],
  order: Array<string | number>,
  key: string
): T {
  const array = [...oldArray];
  array.sort(function (a, b) {
    var A = a[key],
      B = b[key];

    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
  });

  return array as T;
}
