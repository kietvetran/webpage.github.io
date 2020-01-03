let moment = require("moment");

/******************************************************************************
 ******************************************************************************/
export const generateId = () => {
  return (
    "ruter-" +
    new Date().getTime() +
    "-" +
    Math.floor(Math.random() * 10000 + 1)
  );
};

export const capitalize = text => {
  return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";
};

/******************************************************************************
 ******************************************************************************/
export const getFormData = (form, includeUncheck, unTrim) => {
  let data = {},
    selector = "input, select, textarea, checkbox";
  let elements = form ? form.querySelectorAll(selector) : [];

  for (let i = 0; i < elements.length; ++i) {
    let element = elements[i],
      type = element.type;
    let name = element.name,
      value = unTrim ? element.value : trim(element.value, true);

    if (type.match(/radio|checkbox/i) && name) {
      console.log(element);
      if (element.checked) {
        if (data[name]) {
          if (!(data[name] instanceof Array)) {
            data[name] = [data[name]];
          }
          data[name].push(value || 1);
        } else {
          data[name] = value || 1;
        }
      } else if (includeUncheck || type.match(/checkbox/i)) {
        if (data[name]) {
          if (!(data[name] instanceof Array)) {
            data[name] = [data[name]];
          }
          data[name].push(0);
        } else {
          data[name] = 0;
        }
      }
    } else if (name) {
      if (data[name]) {
        if (!(data[name] instanceof Array)) {
          data[name] = [data[name]];
        }
        data[name].push(value);
      } else {
        data[name] = value;
      }
    }
  }
  return data;
};

/******************************************************************************
 ******************************************************************************/
export const triggerFormInputError = form => {
  let selector = "input, select, textarea";
  let elements = form ? form.querySelectorAll(selector) : [];
  for (let i = 0; i < elements.length; ++i) {
    fireEvent(elements[i], "blur");
  }
};

/******************************************************************************
 ******************************************************************************/
export const getURLquery = (
  query,
  wantString,
  ignorHref,
  ignorQuery,
  repeatArray
) => {
  let opt = {},
    key = "",
    list = [],
    url = ignorHref ? "" : window.location.href;
  let matched = url.replace(/\?+/g, "?").match(/^([\w\.\-\s_#%\/:]+)\?(.*)/);

  if (matched) {
    let splited = (decodeURIComponent(matched[2]) || "")
      .replace(/#\?/g, "&")
      .split("&");

    for (let i = 0; i < splited.length; i++) {
      let m = splited[i].match(/(\w+)=(.*)/);
      if (!m || !m[1] || !m[2]) {
        continue;
      }

      let v = m[2].replace(/#$/, "");
      let n = v.match(/^\[(.*)\]$/);
      if (n && n[1]) {
        v = n[1].split(",").reduce((p, d) => {
          if (d) {
            try {
              p.push(JSON.parse(d));
            } catch (error) {
              p.push(d);
            }
          }
          return p;
        }, []);
      }

      if (opt[m[1]]) {
        if (!(opt[m[1]] instanceof Array)) {
          opt[m[1]] = [opt[m[1]]];
        }
        opt[m[1]].push(v);
      } else {
        opt[m[1]] = v;
      }
    }
  }

  if (query && typeof query === "object") {
    for (key in query) {
      opt[key] = query[key];
    }
  }

  if (ignorQuery && typeof ignorQuery === "object") {
    for (key in ignorQuery) {
      delete opt[key];
    }
  }

  if (wantString) {
    for (key in opt) {
      if (repeatArray && opt[key] instanceof Array) {
        for (let j = 0; j < opt[key].length; j++) {
          list.push(key + "=" + opt[key][j]);
        }
      } else {
        list.push(key + "=" + opt[key]);
      }
    }
  }

  return wantString ? list.join("&") : opt;
};

/******************************************************************************
  REG
******************************************************************************/
export const createRegexp = (text, g, i, b, f) => {
  if (text == "*") {
    return /.*/;
  }
  let v = text.replace(/\*/, ".*").replace(/\+/g, "\\+");
  let m = g && i ? "gi" : g || i ? (g ? "g" : "i") : "";
  let s = b ? (b === 2 ? "^" : b === 3 ? "(^|/|\\s+|,)" : "(^|/|\\s+)") : "";
  let e = f ? (f === 2 ? "$" : f === 3 ? "($|/|\\s+|,)" : "($|/|\\s+)") : "";
  return new RegExp(s + "(" + v + ")" + e, m);
};

/******************************************************************************
  getOffset
******************************************************************************/
export const getOffset = target => {
  let size = [0, 0];
  if (target) {
    do {
      size[0] += target.offsetLeft || 0;
      size[1] += target.offsetTop || 0;
      target = target.offsetParent;
    } while (target);
  }
  return size;
};

/******************************************************************************
  Event
******************************************************************************/
export const addEvent = (callback, target, type) => {
  if (target) {
    if (typeof target.addEventListener !== "undefined") {
      target.addEventListener(type, callback, false);
    } else if (typeof target.attachEvent !== "undefined") {
      target.attachEvent("on" + type, callback);
    }
  }
};

export const removeEvent = (myFunction, target, type) => {
  if (target) {
    if (typeof target.removeEventListener !== "undefined") {
      target.removeEventListener(type, myFunction);
    } else if (typeof target.detachEvent !== "undefined") {
      target.detachEvent("on" + type, myFunction);
    }
  }
};

/******************************************************************************
  === cookie ===
******************************************************************************/
export const createCookie = (name, value, day) => {
  if (!name) return;
  let cookie = [name + "=" + (value || "")];
  let d = new Date(),
    expires = day || 1000;
  d.setTime(d.getTime() + expires * 24 * 60 * 60 * 1000);
  cookie.push("expires=" + d.toGMTString());
  cookie.push("path=/");
  document.cookie = cookie.join("; ");
};

export const readCookie = name => {
  let query = getURLquery();
  if (query.ignorcookie) {
    return "";
  }

  let nameEQ = name + "=",
    ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return "";
};

export const eraseCookie = name => {
  return createCookie(name, "", -1);
};

/******************************************************************************
  === ===
******************************************************************************/
export const getCalendarName = () => {
  return [
    "Januar",
    "Februar",
    "Mars",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "Novmber",
    "Desember"
  ];
};

export const getWeekName = () => {
  return [
    "Søndag",
    "Mandag",
    "Tirsdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag"
  ];
};

/******************************************************************************
  getWindowSize
******************************************************************************/
export const getWindowSize = () => {
  let size = [0, 0];
  if (!window.innerWidth) {
    // IE
    if (!(document.documentElement.clientWidth === 0)) {
      size[0] = document.documentElement.clientWidth;
      size[1] = document.documentElement.clientHeight;
    } else {
      size[0] = document.body.clientWidth;
      size[1] = document.body.clientHeight;
    }
  } else {
    size[0] = window.innerWidth;
    size[1] = window.innerHeight;
  }
  return size;
};

/******************************************************************************
  clear windown selection
******************************************************************************/
export const clearSelection = () => {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
};

/******************************************************************************
 ******************************************************************************/
export const getClosestParent = (target, what) => {
  if (!target || !what) {
    return;
  }

  let key = what.replace(/^\#/, "");
  let check = what.match(/^\#/) ? "id" : "class";
  let verify = (parent, type, specific) => {
    if (!parent || (parent.tagName || "").match(/^html/i)) {
      return;
    }

    if (specific) {
      let t = parent.getAttribute("id") == type;
      return t ? parent : verify(parent.parentNode, type, specific);
    }

    return hasClass(parent, type)
      ? parent
      : verify(parent.parentNode, type, specific);
  };
  return verify(target, key, check === "id");
};

/******************************************************************************
 ******************************************************************************/
export const getParentScroll = (target, max = 1000) => {
  let parent = target ? target.parentNode : null,
    out = [0, 0];
  let done = false,
    scrolled = [0, 0];
  while (!!parent && --max > 0) {
    done = parent.tagName.match(/^body$/i) ? true : false;
    scrolled = done
      ? getDocumentScrollPosition()
      : [parent.scrollLeft || 0, parent.scrollTop || 0];

    out[0] += scrolled[0];
    out[1] += scrolled[1];
    parent = done ? null : parent.parentNode;
  }
  return out;
};

export const getDocumentScrollPosition = () => {
  if (typeof window.pageYOffset !== "undefined") {
    return [window.pageXOffset, window.pageYOffset];
  }

  if (
    typeof document.documentElement.scrollTop !== "undefined" &&
    document.documentElement.scrollTop > 0
  ) {
    return [
      document.documentElement.scrollLeft,
      document.documentElement.scrollTop
    ];
  }

  return typeof document.body.scrollTop !== "undefined"
    ? [document.body.scrollLeft, document.body.scrollTop]
    : [0, 0];
};

export const _scrollBodyTop = where => {
  document.body.scrollTop = document.documentElement.scrollTop =
    where && !isNaN(where) && where > 0 ? where : 0;
};

export const scrollBodyTop = (to, duration, target, ignorIfAlreadyInview) => {
  if (duration && !isNaN(duration) && duration > 100) {
    if (target !== undefined) {
      if (!target) {
        return;
      }
      let offset = getOffset(target);
      to = offset[1] || 0;
    }

    if (isNaN(to) || to < 0) {
      to = 0;
    }
    let position = getDocumentScrollPosition(),
      base = position[1],
      timing = 20;

    if (ignorIfAlreadyInview) {
      let size = getWindowSize();
      if (to >= base && to <= base + size[1]) {
        return;
      }
    }

    let goingUp = base > to,
      distance = goingUp ? base - to : to - base;
    let step = Math.ceil(distance / (duration / timing)),
      stop = false;

    let render = () => {
      base += step * (goingUp ? -1 : 1);
      if ((goingUp && base <= to) || (!goingUp && base >= to) || base < 0) {
        base = to;
        stop = true;
      }
      document.body.scrollTop = document.documentElement.scrollTop = base;
      if (!stop) {
        setTimeout(render, timing);
      }
    };

    render();
  } else {
    document.body.scrollTop = document.documentElement.scrollTop =
      to && !isNaN(to) && to > 0 ? to : 0;
  }
};

/******************************************************************************
 ******************************************************************************/
export const trim = (text, multipleWhiteSpace) => {
  let out = ((text || "") + "").replace(/^\s+/, "").replace(/\s+$/g, "");
  return multipleWhiteSpace ? out.replace(/\s+/g, " ") : out;
};

/******************************************************************************
 ******************************************************************************/
export const convertDateToText = (
  date,
  separator,
  clock,
  americanFormat,
  clockSeparation
) => {
  let s =
    typeof separator === "undefined" || separator === null
      ? americanFormat
        ? "-"
        : "."
      : separator;
  let l = [date.getDate(), date.getMonth() + 1, date.getFullYear()],
    i = 0;
  if (americanFormat) {
    let y = l[2];
    l[2] = l[0];
    l[0] = y;
  }

  for (i = 0; i < l.length; i++) {
    if (l[i] < 10) {
      l[i] = "0" + l[i];
    }
  }

  let out = l.join(s);
  if (!clock) {
    return out;
  }

  l = [date.getHours(), date.getMinutes()];
  for (i = 0; i < l.length; i++) {
    if (l[i] < 10) {
      l[i] = "0" + l[i];
    }
  }
  return out + (clockSeparation || " ") + l.join(":");
};

export const convertTextToDate = (text, wantTimestamp) => {
  let r = /^(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.](\d{4})(\s+(([0-1]\d)|(2[0-3])):([0-5]\d):([0-5]\d))?/;
  let t = (text || "").replace(/^\s+/, "").replace(/\s+$/, "");
  let m = t.match(r),
    s = null;
  if (m) {
    s = [m[3], m[2], m[1], m[5], m[8], m[9] || "0", "0"];
  } else {
    r = /^(\d{4})[\/\-\.](0?[1-9]|1[012])[\/\-\.]([0][1-9]|[12][0-9]|3[01])(\w+(([0-1]\d)|(2[0-3])):([0-5]\d):([0-5]\d))?/;
    m = t.match(r);
    if (m) {
      s = [m[1], m[2], m[3], m[5], m[8], m[9] || "0", "0"];
    }
  }

  if (!s) {
    return;
  }

  for (let i = 0; i < s.length; i++) {
    s[i] = parseInt((s[i] || "").replace(/^0/, "") || "0", 10);
  }
  let date = new Date(s[0], s[1] - 1, s[2], s[3], s[4], s[5], s[6]);

  if (text.match(/Z$/i)) {
    let zone = getTimeZone(date).replace(/\:00/g, "");
    let number = parseFloat(zone),
      hour = date.getHours();
    date.setHours(hour + number);
  }

  return wantTimestamp ? date.getTime() : date;
};

export const getTimeZone = date => {
  let current = date || new Date();
  var offset = current.getTimezoneOffset(),
    o = Math.abs(offset);
  return (
    (offset < 0 ? "+" : "-") +
    ("00" + Math.floor(o / 60)).slice(-2) +
    ":" +
    ("00" + (o % 60)).slice(-2)
  );
};

export const getWeekOfDate = (date, asText) => {
  if (!date) {
    date = new Date();
  }

  let onejan = new Date(date.getFullYear(), 0, 1);
  let number = Math.ceil(
    ((date - onejan) / 86400000 + onejan.getDay() + 1) / 7
  );
  return asText ? (number < 10 ? "0" + number : number) + "" : number;
};

export const getCalendarIntervalList = (fromDate, toDate, view, monthNames) => {
  if (!view) {
    view === "monthly";
  }
  if (!monthNames) {
    monthNames = getCalendarName();
  }

  let fTime = fromDate ? fromDate.getTime() : null;
  let tTime = toDate ? toDate.getTime() : null;
  if (fTime === null && tTime === null) {
    return;
  }

  let interval = [new Date(fTime), new Date(tTime)];
  if (view === "daily" || view === "DAYS") {
  } else if (view === "weekly" || view === "WEEKS") {
    let day = interval[0].getDay() || 7;
    interval[0].setDate(interval[0].getDate() - day + 1);

    day = interval[1].getDay() || 7;
    interval[1].setDate(interval[1].getDate() - day + 1);
  } else {
    interval[0].setDate(1);
    interval[1].setDate(1);
  }

  interval[0].setHours(0);
  interval[0].setMinutes(0);
  interval[0].setSeconds(0);
  interval[1].setHours(23);
  interval[1].setMinutes(59);
  interval[1].setSeconds(59);

  let out = [],
    counter = 0,
    weekName = getWeekName();
  while (interval[0].getTime() <= interval[1].getTime() && counter++ < 500) {
    let month = monthNames[interval[0].getMonth()] || "";
    let short = month.substring(0, 3);
    let year = interval[0].getFullYear();
    let data = {
      name: trim([short, year].join(" "), true),
      month: month,
      stamp: interval[0].getTime()
    };
    if (view === "daily" || view === "DAYS") {
      data.name =
        weekName[interval[0].getDay()] + " " + convertDateToText(interval[0]);
      interval[0].setDate(interval[0].getDate() + 1);
    } else if (view === "weekly" || view === "WEEKS") {
      data.name = "Uke " + getWeekOfDate(interval[0], true) + " " + year;
      interval[0].setDate(interval[0].getDate() + 7);
    } else {
      interval[0].setMonth(interval[0].getMonth() + 1);
    }

    data.nextStamp = interval[0].getTime();
    out.push(data);
  }
  return out;
};

/******************************************************************************
 ******************************************************************************/
export const splitText = (text, split) => {
  let i = (text || "").length % split,
    list = i ? [text.substr(0, i)] : [];
  for (i; i < text.length; i += split) {
    list.push(text.substr(i, split));
  }
  return list;
};

export const separatePhoneCountryCode = text => {
  if (!text) {
    text = "";
  }
  let out = ["", text];
  if (text.match(/^\+/)) {
    out[0] = "+";
    out[1] = out[1].replace(/^\+/, "");
    let splited = out[1].split("");
    if (splited.length > 2) {
      out[0] += splited.shift() + splited.shift() + " ";
      out[1] = splited.join("");
    }
  }
  return out;
};

export const splitPhone = (text, switcher) => {
  let separated = separatePhoneCountryCode(text);
  if (separated[0] === "+47 ") {
    // Norway
    switcher = [3, 2];
  } else if (separated[0] === "+45 ") {
    // Denmark
    switcher = [2, 2];
  } else if (separated[0] === "+46 ") {
    // Sweden
    switcher = null;
  }

  let a = separated[1].split(""),
    list = [];
  if (switcher) {
    let t = switcher[0],
      j = 0;
    for (let i = 0; i < a.length; i++) {
      if (!list[j]) {
        list[j] = "";
      }

      list[j] += a[i] + "";
      if (--t === 0) {
        t = list[j].length === switcher[0] ? switcher[1] : switcher[0];
        j = j + 1;
      }
    }
  }
  return separated[0] + (list.length ? list.join(" ") : a.join(""));
};

export const getFormat = (value, type, detail, timeView) => {
  let text = ((value || "") + "").replace(/\s+/g, ""),
    out = "";
  let roundToTwo = num => {
    return +(Math.round(num + "e+2") + "e-2");
  };

  if (type === "accountnumber") {
    out = [text.substring(0, 4), text.substring(4, 6), text.substring(6)]
      .join(" ")
      .replace(/\s+/g, " ")
      .replace(/\s+$/g, "");
  } else if (type === "personnumber") {
    out = [text.substring(0, 6), text.substring(6)]
      .join(" ")
      .replace(/\s+/g, " ")
      .replace(/\s+$/g, "");
  } else if (type === "organizationsnumber") {
    out = [
      text.substring(0, 3),
      text.substring(3, 6),
      text.substring(6, 9),
      text.substring(9, 12)
    ]
      .join(" ")
      .replace(/\s+/g, " ")
      .replace(/\s+$/g, "");
  } else if (type === "mileage") {
    let n = parseFloat((text || "0") + "");
    out = roundToTwo(n);
  } else if (type === "amount") {
    out = splitText(text, 3).join(" ");
  } else if (type === "percentage") {
    out = parseFloat(text) * 100;
  } else if (type === "creditcardnumber") {
    //out = splitText( text, 4 ).join(' ');
    out = [
      text.substring(0, 4),
      text.substring(4, 8),
      text.substring(8, 12),
      text.substring(12, 16)
    ]
      .join(" ")
      .replace(/\s+/g, " ")
      .replace(/\s+$/g, "");
  } else if (type === "telephone") {
    out = splitPhone(text, [2, 2]);
  } else if (type === "mobile") {
    out = splitPhone(text, [3, 2]);
  } else if (type === "minute2time") {
    let number = parseInt(text);
    if (!isNaN(number)) {
      let hour = 0,
        minute = number || 0,
        anHour = 60;
      while (minute >= anHour) {
        minute -= anHour;
        hour++;
      }

      let out =
        (minute < 10 ? "0" : "") +
        minute +
        " minutt" +
        (minute > 1 ? "er" : "");
      return (hour ? hour + " time" + (hour > 1 ? "r " : " ") : "") + out;
    }
  } else if (type === "second2time" || type === "millisecond2time") {
    let number = parseInt(text);
    let second = isNaN(number)
      ? null
      : type === "millisecond2time" && number < 1000
      ? null
      : type === "millisecond2time"
      ? paseInt(number / 100)
      : number;

    if (number !== null) {
      let anHour = 60 * 60,
        aDay = 24 * anHour,
        day = 0;
      while (second > aDay) {
        second -= aDay;
        day++;
      }

      let hour = 0;
      while (second > anHour) {
        second -= anHour;
        hour++;
      }

      let minute = 0;
      while (second > 59) {
        second -= 60;
        minute++;
      }

      if (timeView) {
        out =
          (day ? day + " dag" + (day > 1 ? "er" : "") : "") +
          [hour, minute, second]
            .map(v => {
              return v < 10 ? "0" + v : v;
            })
            .join(":");
      } else {
        let a = day ? day + " dag" + (day > 1 ? "er" : "") : "";
        let b = hour ? hour + " time" + (hour > 1 ? "r" : "") : "";
        let c = minute ? minute + " min" : detail ? "0 min" : "";
        let d = second ? second + " sek" : detail ? "0 sek" : "";
        out = trim([a, b, c, d].join(" "), true);
      }
    }
  } else if (type === "timestamp2date") {
    let number = parseInt(text);
    if (!isNaN(number)) {
      let date = new Date(number);
      out = convertDateToText(date);
    }
  } else if (type === "devi-date") {
    out = text
      ? moment(text, "YYYY-MM-DDTHH:mm:ssZ").format("DD.MM.YYYY, HH:mm")
      : "-";
  } else if (type === "journey" || type === "block") {
    let matched = text.match(/(\d+)\-(.*)/);
    if (matched && matched[1] && matched[2]) {
      out =
        type === "block"
          ? matched[1]
          : matched[1] + " " + moment(matched[2]).format("DD.MM.YYYY, HH:mm");
    }
  }

  return typeof out == "number" ? out : out || text;
};

export const isValid = (value, type) => {
  let text = (value || "").replace(/\s+/g, ""),
    out = false;

  if (type === "email") {
    out = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(text);
  } else if (type === "countrycode") {
    out = /^\+([0-9]{2}(\s+)?|[0-9]{3})$/i.test(text);
  } else if (type === "mobile" || type === "telephone" || type === "phone") {
    out = /^[1-9][0-9]{7,}$/i.test(text);
  } else if (type === "ratio") {
    out = /^[0-9]{1,2}\:[0-9]{1,2}$/i.test(text);
  } else if (type === "url") {
    out = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g.test(
      text
    );
  } else if (type === "number") {
    out = /^[0-9]+$/.test(text);
  } else if (type === "ifDefined") {
    return true;
  }

  return out;
};

export const getDatesDifference = (dateA, dateB, abstract) => {
  if (!dateA || !dateB) {
    return 0;
  }

  let aDay = 1000 * 60 * 60 * 24;
  let timeDiff = abstract
    ? Math.abs(dateA.getTime() - dateB.getTime())
    : dateB.getTime() - dateA.getTime();
  return Math.round(timeDiff / aDay);
};

/******************************************************************************
 ******************************************************************************/
export const sortList = (list, field, decreasing, numberTest, dateFormat) => {
  let keys = field instanceof Array ? field : [field];
  let i = 0,
    length = keys.length;
  return list
    ? list.sort((a, b) => {
        let z = 0,
          x = "",
          y = "";
        for (i = 0; i < length; i++) {
          x = (a[keys[i]] || "") + "";
          y = (b[keys[i]] || "") + "";
          //if ( dateFormat ) { console.log('== X =='); console.log('x value => ' +x); console.log('y value => ' +y);}

          if (numberTest && !x.match(/^[a-z]/i) && !y.match(/^[a-z]/i)) {
            x = parseFloat(x);
            y = parseFloat(y);
          } else if (dateFormat) {
            x = moment(x, dateFormat);
            y = moment(y, dateFormat);

            x = x.isValid()
              ? x.unix()
              : moment("9999-12-31", "YYYY-MM-DD").unix();
            y = y.isValid()
              ? y.unix()
              : moment("9999-12-31", "YYYY-MM-DD").unix();
          }

          z = x < y ? -1 : x > y ? 1 : 0;
          if (z !== 0) {
            i = length;
          }
        }

        let v = z * (decreasing ? -1 : 1);
        return v * (dateFormat ? -1 : 1);
      })
    : [];
};

/******************************************************************************
 ******************************************************************************/
export const addClass = (target, type) => {
  if (!target) {
    return;
  }

  let v = target.getAttribute("class");
  if (!v) {
    return target.setAttribute("class", type);
  }

  let s = trim(type, true).split(" "),
    n = v;
  for (let i = 0; i < s.length; i++) {
    if (!s[i]) {
      continue;
    }
    let r = new RegExp("(^|\\s+)" + s[i] + "($|\\s+)", "g");
    if (!n.match(r)) {
      n = trim(n + " " + s[i], true);
    }
  }

  n = trim(n, true);
  if (n !== v) {
    target.setAttribute("class", n);
  }
};

export const removeClass = (target, type) => {
  if (!target) return;

  let v = target.getAttribute("class");
  if (!v) {
    return;
  }

  let s = trim(type, true).split(" ");
  for (let i = 0; i < s.length; i++) {
    if (!s[i]) {
      continue;
    }
    let r = new RegExp("(^|\\s+)" + s[i] + "($|\\s+)", "g");
    v = v.replace(r, " ");
  }

  v = trim(v, true);
  v ? target.setAttribute("class", v) : target.removeAttribute("class");
  //if ( v.match( r ) ) { target.setAttribute( 'class', trim((v.split(r)).join(' '), true) );}
};

/******************************************************************************
 ******************************************************************************/
export const convertUtf8ToBase64 = str => {
  return window.btoa(unescape(encodeURIComponent(str)));
};

export const convertBase64ToUtf8 = str => {
  return decodeURIComponent(escape(window.atob(str)));
};

export const convertAsciiToAtob = ascii => {
  return Uint8Array.from(atob(ascii), c => c.charCodeAt(0));
};
export const convertBufferToBtoa = buffer => {
  var binary = [];
  var bytes = new Uint8Array(buffer);
  for (var i = 0, il = bytes.byteLength; i < il; i++) {
    binary.push(String.fromCharCode(bytes[i]));
  }
  return btoa(binary.join(""));
};

/******************************************************************************
 ******************************************************************************/
export const debug = (text, value) => {
  let id = "my-debuggin-widget",
    debug = document.getElementById(id),
    v = "",
    d = new Date();
  if (!debug) {
    let style =
      "position:fixed;bottom:0;right:0;z-index:1000;border:1px solid red; " +
      "overflow:scroll;font-size:10px;line-height:11px;height:150px; width:210px; background-color:#fff";
    debug = document.createElement("div");
    debug.setAttribute("id", id);
    debug.setAttribute("style", style);
    document.body.appendChild(debug);
  }

  let p = debug.innerHTML || "",
    t = d.getMinutes() + ":" + d.getSeconds();
  if (value != null) {
    if (typeof value != "object") v = value;
    else if (value instanceof Array) v = value.join("<br/>");
    else {
      let data = [];
      for (let k in value) {
        data.push(k + " : " + value[k]);
      }
      v = data.join("<br/>");
    }
  }
  debug.innerHTML = t + "<br/>" + text + "<br/>" + v + "<div>&nbsp;</div>" + p;
};
