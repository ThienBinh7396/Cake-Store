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

export const change_alias = (str) => {
  str = str.trim();

  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/\s+/g, "-");
  return str;
}