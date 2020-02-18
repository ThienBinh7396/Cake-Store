export const dayInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const monthInYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatNumber = num => (num > 9 ? num : `0${num}`);

export const formatDate = (str, type) => {
  let date = new Date(str);

  let d = date.getDate();
  let month = date.getMonth() + 1;
  let y = date.getFullYear();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();

  let f = "";
  let full = `${d}/${month}/${y} ${h}:${formatNumber(m)}:${formatNumber(s)}`;
  switch (type) {
    case 1: //ex: 10:10pm
      f = `${h > 12 ? h - 12 : h}:${formatNumber(m)}${h > 12 ? " pm" : " am"}`;
      break;

    case 2: //ex: Sat, Aug 29
      console.log(date.getDay());
      f = `${dayInWeek[date.getDay()]}, ${
        monthInYear[month - 1]
      } ${formatNumber(d)}`;
      break;

    case 3: //ex: 03/07/1996
      f = `${month}/${d}/${y}`;
      break;

    case 4: //ex: 12:00
      f = `${formatNumber(h)}:${formatNumber(m)}`;
      break;

    case 5: //ex: 10:10:10pm
      f = `${h}:${formatNumber(m)}:${formatNumber(s)}`;
      break;
    case 6: //ex: Nov 20, 2019, 8:35 AM
      f = `${monthInYear[month - 1]} ${formatNumber(d)}, ${y}, ${h}:${m}${
        h > 12 ? "PM" : "AM"
      }`;
      break;
    default:
  }
  return {
    format: f,
    fullType: full
  };
};