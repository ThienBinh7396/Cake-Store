const matchBreakPoint = Object.entries({
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920
}).reduce((arr, current) => {
  return [
    ...arr,
    {
      key: current[0],
      value: current[1]
    }
  ];
}, []);

export const widthToBreackpoint = width => {
  let index = matchBreakPoint.findIndex(it => it.value > width);
  return index ? matchBreakPoint[index - 1].key : 'xl';
};
