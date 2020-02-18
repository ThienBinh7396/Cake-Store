const DEFAULT_TIME = 7 ;

const cookie = {
  setCookie: (key, value, expired = DEFAULT_TIME) => {
    let d = new Date();

    d.setTime(d.getTime() + expired * 24 *60 * 60 * 1000);

    let exp = `expires=${d.toUTCString()}`;
    
    if(value){
      document.cookie = `${key}=${btoa(JSON.stringify(value))};${exp};path=/`;
    }else{
      document.cookie = `${key}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    }
  }
,
  getCookie: (key) => {
      let regex = new RegExp(`${key}=(.+)`, "im");

      let cookie = document.cookie;

      cookie = cookie.split(';')
        .filter(it => regex.test(it));

      return cookie.length !== 0 ? JSON.parse(atob(cookie[0].match(regex)[1])) : null; 
  }
}

export default cookie;