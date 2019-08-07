const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var getBiggerzIndex = (function() {
  //定义弹出层ui的最小zIndex
  let index = 2000;
  return function(level = 0) {
    return level + (++index);
  };
})();

/**
 * @description 静态日期操作类，封装系列日期操作方法
 * @description 输入时候月份自动减一，输出时候自动加一
 * @return {object} 返回操作方法
 */
let dateUtil = {

  //根据一个日期获取所有信息
  getDetail: function(date) {
    if (!date) date = new Date();
    var d, now = new Date(),
      dateInfo = {},
      _diff;
    var weekDayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    if (typeof date === 'number') {
      d = new Date();
      d.setTime(date);
      date = d;
    }

    //充值date对象，让其成为一天的起点时间
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    now = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    _diff = date.getTime() - now.getTime();

    if (_diff == 0) {
      dateInfo.day1 = '今天';
    } else if (_diff == 86400000) {
      dateInfo.day1 = '明天';
    } else if (_diff == 172800000) {
      dateInfo.day1 = '后天';
    }

    dateInfo.weekday = weekDayArr[date.getDay()];

    dateInfo.year = date.getFullYear();
    dateInfo.month = date.getMonth() + 1;
    dateInfo.day = date.getDate();

    return dateInfo;

  },

  //获取n个月
  preMonth: function(d, n) {
    if (typeof d === 'string') d = new Date(d);
    else d = new Date();
    let date = new Date(d.getFullYear(), d.getMonth() - n, d.getDate())
    return date;
  },

  nextMonth: function(d, n) {
    if (typeof d === 'string') d = new Date(d);
    else d = new Date();
    let date = new Date(d.getFullYear(), d.getMonth() + n, d.getDate())
    return date;
  },

  //获取前一个天
  preDay: function(d) {
    if (typeof d === 'string') d = new Date(d);
    else d = new Date();
    let date = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1)
    return date;
  },

  nextDay: function(d) {
    if (typeof d === 'string') d = new Date(d);
    else d = new Date();
    let date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
    return date;
  },

  /**
   * @description 数字操作，
   * @return {string} 返回处理后的数字
   */
  formatNum: function(n) {
    if (n < 10) return '0' + n;
    return n;
  },
  /**
   * @description 将字符串转换为日期，支持格式y-m-d ymd (y m r)以及标准的
   * @return {Date} 返回日期对象
   */
  parse: function(dateStr, formatStr) {
    if (typeof dateStr === 'undefined') return null;
    if (typeof formatStr === 'string') {
      var _d = new Date(formatStr);
      //首先取得顺序相关字符串
      var arrStr = formatStr.replace(/[^ymd]/g, '').split('');
      if (!arrStr && arrStr.length != 3) return null;

      var formatStr = formatStr.replace(/y|m|d/g, function(k) {
        switch (k) {
          case 'y':
            return '(\\d{4})';
          case 'm':
            ;
          case 'd':
            return '(\\d{1,2})';
        }
      });

      var reg = new RegExp(formatStr, 'g');
      var arr = reg.exec(dateStr)

      var dateObj = {};
      for (var i = 0, len = arrStr.length; i < len; i++) {
        dateObj[arrStr[i]] = arr[i + 1];
      }
      return new Date(dateObj['y'], dateObj['m'] - 1, dateObj['d']);
    }
    return null;
  },
  /**
   * @description将日期格式化为字符串
   * @return {string} 常用格式化字符串
   */
  format: function(date, f) {
    if (arguments.length < 2 && !date.getTime) {
      format = date;
      date = new Date();
    } else if (arguments.length == 2 && typeof date === 'number' && typeof f === 'string') {
      var d = new Date();
      d.setTime(date);
      date = d;
    }

    typeof f != 'string' && (f = 'Y年M月D日 H时F分S秒');
    return f.replace(/Y|y|M|m|D|d|H|h|F|f|S|s/g, function(a) {
      switch (a) {
        case "y":
          return (date.getFullYear() + "").slice(2);
        case "Y":
          return date.getFullYear();
        case "m":
          return date.getMonth() + 1;
        case "M":
          return dateUtil.formatNum(date.getMonth() + 1);
        case "d":
          return date.getDate();
        case "D":
          return dateUtil.formatNum(date.getDate());
        case "h":
          return date.getHours();
        case "H":
          return dateUtil.formatNum(date.getHours());
        case "f":
          return date.getMinutes();
        case "F":
          return dateUtil.formatNum(date.getMinutes());
        case "s":
          return date.getSeconds();
        case "S":
          return dateUtil.formatNum(date.getSeconds());
      }
    });
  },
  // @description 是否为为日期对象，该方法可能有坑，使用需要慎重
  // @param year {num} 日期对象
  // @return {boolean} 返回值
  isDate: function(d) {
    if ((typeof d == 'object') && (d instanceof Date)) return true;
    return false;
  },
  // @description 是否为闰年
  // @param year {num} 可能是年份或者为一个date时间
  // @return {boolean} 返回值
  isLeapYear: function(year) {
    //传入为时间格式需要处理
    if (_.dateUtil.isDate(year)) year = year.getFullYear()
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) return true;
    return false;
  },

  // @description 获取一个月份的天数
  // @param year {num} 可能是年份或者为一个date时间
  // @param year {num} 月份
  // @return {num} 返回天数
  getDaysOfMonth: function(year, month) {
    //自动减一以便操作
    month--;
    if (_.dateUtil.isDate(year)) {
      month = year.getMonth(); //注意此处月份要加1，所以我们要减一
      year = year.getFullYear();
    }
    return [31, _.dateUtil.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  },

  // @description 获取一个月份1号是星期几，注意此时的月份传入时需要自主减一
  // @param year {num} 可能是年份或者为一个date时间
  // @param year {num} 月份
  // @return {num} 当月一号为星期几0-6
  getBeginDayOfMouth: function(year, month) {
    //自动减一以便操作
    month--;
    if ((typeof year == 'object') && (year instanceof Date)) {
      month = year.getMonth();
      year = year.getFullYear();
    }
    var d = new Date(year, month, 1);
    return d.getDay();
  },

  //将数字（整数）转为汉字，从零到一亿亿，需要小数的可自行截取小数点后面的数字直接替换对应arr1的读法就行了
  convertToChinaNum: function(num) {
    var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
    var arr2 = new Array('', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿'); //可继续追加更高位转换值
    if (!num || isNaN(num)) {
      return "零";
    }
    var english = num.toString().split("")
    var result = "";
    for (var i = 0; i < english.length; i++) {
      var des_i = english.length - 1 - i; //倒序排列设值
      result = arr2[i] + result;
      var arr1_index = english[des_i];
      result = arr1[arr1_index] + result;
    }
    //将【零千、零百】换成【零】 【十零】换成【十】
    result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
    //合并中间多个零为一个零
    result = result.replace(/零+/g, '零');
    //将【零亿】换成【亿】【零万】换成【万】
    result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
    //将【亿万】换成【亿】
    result = result.replace(/亿万/g, '亿');
    //移除末尾的零
    result = result.replace(/零+$/, '')
    //将【零一十】换成【零十】
    //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
    //将【一十】换成【十】
    result = result.replace(/^一十/g, '十');
    return result;
  },

  // 计算日期之间相差天数
  dateDiff: function(sDate1, sDate2) {
    sDate1 = new Date(sDate1);
    sDate2 = new Date(sDate2);
    let iDays = parseInt((sDate1 - sDate2) / 1000 / 60 / 60 / 24); // 把相差的毫秒数转换为天数
    return iDays; //返回相差天数
  },

  /** 
   * 时间戳转化为年 月 日 时 分 秒 
   * number: 传入时间戳 
   * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
   */
  formatTime: function formatTime(number, format) {
    var date = new Date(number);
    return this.format(date, format);
  }
};

var navigateTo = function(url, isCheckLogin) {
  // 检查是否登录
  if (isCheckLogin) {
    wx.getStorage({
      key: 'isLogin',
      success: function(res) {
        if (res.data) {
          wx.navigateTo({
            url: url,
          })
        } else {
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
      }
    })
  } else {
    wx.navigateTo({
      url: url,
    })
  }
};

var parseDouble = function(num) {
  if (num < 0) num = 0;
  num += '';
  num = num.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符  
  if (/^0+/) //清除字符串开头的0  
    num = num.replace(/^0+/, '');
  if (!/\./.test(num)) //为整数字符串在末尾添加.00  
    num += '.00';
  if (/^\./.test(num)) //字符以.开头时,在开头添加0  
    num = '0' + num;
  num += '00'; //在字符串末尾补零  
  num = num.match(/\d+\.\d{2}/)[0];
  return num;
};


/**
 * 身份证
 */
var CardIDUtil = {
  cityAreaId: {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外"
  },
  birthday: "",
  sex: "",
  /**
   * 根据校验码验证身份证号是否存在
   * @param param  身份证号
   * @returns {*}
   */
  cardIdIsExist: function(param) {
    var iSum = 0;
    var weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var validate = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    for (var i = 0; i < param.length - 1; i++) {
      iSum += param.charAt(i) * weight[i];
    }
    var mode = iSum % 11;
    if (param.charAt(param.length - 1) != validate[mode]) {
      return "你输入的身份证不合法";
    } else {
      if (param.charAt(param.length - 2) % 2 == 0) {
        this.sex = "1"; //女
      } else {
        this.sex = "0"; //男
      }
    }
    return true;

    /* }*/
  },

  /**
   * 验证用户输入的身份证号
   * @param param 身份证号
   * @returns {*}
   */
  verification: function(param) {
    if (!/^\d{17}(\d|x)$/i.test(param)) {
      if (!InputText.nonEmpty(param)) {
        return "你输入的身份证不合法";
      }
      return "你输入的身份证不合法";
    } else if (this.cityAreaId[parseInt(param.substr(0, 2))] == null) {
      return "你输入的身份证不合法";
    } else {
      var birthday = param.substr(6, 4) + "-" + Number(param.substr(10, 2)) + "-" + Number(param.substr(12, 2));
      var date = new Date(birthday.replace(/-/g, "/"));
      this.birthday = date;
      if (birthday != (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())) {
        return "你输入的身份证不合法";
      } else {
        this.birthday = birthday;
      }
      return this.cardIdIsExist(param);
    }
  }
}

module.exports = {
  formatTime: formatTime,
  getBiggerzIndex: getBiggerzIndex,
  dateUtil: dateUtil,
  navigateTo: navigateTo,
  parseDouble: parseDouble,
  cardIDUtil: CardIDUtil
}