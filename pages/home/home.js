const util = require('../../utils/util.js')
const request = require('../../utils/request.js')
var app = getApp();

// pages/home/home.wxml.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ImageList: [],
    indicatorDots: false, //小点
    autoplay: true, //是否自动轮播
    interval: 3000, //间隔时间
    duration: 300, //滑动时间
    qrImage: '/resources/images/home/qr',
    dyImage: '/resources/images/home/dy',
    zdImage: '/resources/images/home/zd',
    searchImage: '/resources/images/home/search.png',
    locationImage: '/resources/images/home/location.png',
    calendarImage: '/resources/images/home/calendar.png',
    searchBtnImage: '/resources/images/home/search_w.png',
    rightArrowImage: '/resources/images/right-arr.png',
    showModal: false,
    tjfyList: [],
    currentRzlx: 1,
    clickMaskClose: false,
    startDate: util.dateUtil.format(new Date(), 'Y-M-D'),
    endDate: util.dateUtil.format(util.dateUtil.nextMonth(new Date(), 3), 'Y-M-D'),
    rzsj: ' 14:00:00',   // 入住时间
    tfsj: ' 12:00:00',    // 退房时间
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '首页', //导航栏 中间的标题
    },
    timeIndex1: -1,
    timeInex2: -1,
    timeList:[],
    showTimeModal: false,
    rzxs: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 加载轮播图片
    this.loadImages();
    // 加载位置信息
    this.getLocation();

    this.setData({
      rzrq: util.dateUtil.format(new Date(), 'M月D'),
      tfrq: util.dateUtil.format(util.dateUtil.nextDay(), 'M月D'),
      rzsjWeek: util.dateUtil.getDetail(new Date()).weekday,
      ldsjWeek: util.dateUtil.getDetail(util.dateUtil.nextDay()).weekday,
      rzts: '一天',
      rztsNum: 1,
      rzsjDate: util.dateUtil.format(new Date(), 'Y-M-D'),
      ldsjDate: util.dateUtil.format(util.dateUtil.nextDay(), 'Y-M-D'),
    });

    this.initTimeList();
  },

  /**
   * 用户选择入住时间
   */
  selectRzsj: function() {
    if (this.data.currentRzlx == '3') {
      this.setData({
        showTimeModal: true,
        timeIndex1: -1,
        timeIndex2: -1
      })
    } else {
      this.setData({
        showModal: true
      })
    }
  },

  /**
   * 取消选择入住时间
   */
  unSelectRzsj: function() {
    if (this.data.currentRzlx == '3') {
      this.setData({
        showTimeModal: false
      })
    } else {
      this.setData({
        showModal: false
      })
    }
  },

  // 处理日期选择事件
  handleSelectDate(e) {
    let dateStart = e.detail.dateStart;
    let dateEnd = e.detail.dateEnd;
    let rzts = util.dateUtil.dateDiff(this.formaDate(dateEnd), this.formaDate(dateStart));
    this.setData({
      showModal: false,
      rztsNum: rzts,
      rzrq: util.dateUtil.formatNum(dateStart.month) + '月' + util.dateUtil.formatNum(dateStart.day) + '日',
      tfrq: util.dateUtil.formatNum(dateEnd.month) + '月' + util.dateUtil.formatNum(dateEnd.day) + '日',
      rzts: util.dateUtil.convertToChinaNum(rzts) + '天',
      rzsjDate: this.formaDate(dateStart),
      ldsjDate: this.formaDate(dateEnd),
      rzsjWeek: util.dateUtil.getDetail(util.dateUtil.parse(this.formaDate(dateStart), 'y-m-d')).weekday,
      ldsjWeek: util.dateUtil.getDetail(util.dateUtil.parse(this.formaDate(dateEnd), 'y-m-d')).weekday,
    })
  },

  // 格式化日期
  formaDate: function(date) {
    return util.dateUtil.formatNum(date.year) + '-' + util.dateUtil.formatNum(date.month) + '-' + util.dateUtil.formatNum(date.day)
  },

  /**
   * 跳转到搜索房间界面
   */
  searchRoom: function() {
    var params = {
      rzrq: this.data.rzrq,
      tfrq: this.data.tfrq,
      rzts: this.data.rzts,
      rzsjDate: this.data.rzsjDate,
      ldsjDate: this.data.ldsjDate,
      rzsjWeek: this.data.rzsjWeek,
      ldsjWeek: this.data.ldsjWeek,
      rzlx: this.data.currentRzlx,
      rzsj: this.data.rzsj,
      tfsj: this.data.tfsj,
      rztsNum: this.data.rztsNum,
      rzxs: this.data.rzxs
    }
    util.navigateTo('/pages/home/search/search?ydsj=' + JSON.stringify(params), true);
  },

  /**
   * 选择入住类型
   */
  selectRzlx: function(e) {
    if (e.currentTarget.dataset.rzlx == 1) {
      this.setData({
        rzsj: ' 14:00:00',
        tfsj: ' 12:00:00'
      })
    } else if (e.currentTarget.dataset.rzlx == 2) {
      this.setData({
        startDate: util.dateUtil.format(new Date(), 'Y-M-D'),
        endDate: util.dateUtil.format(util.dateUtil.nextDay(new Date()), 'Y-M-D'),
        rzsj: ' 22:00:00',
        tfsj: ' 10:00:00'
      })
    }
    this.setData({
      currentRzlx: e.currentTarget.dataset.rzlx
    });
  },

  /**
   * 开关点击事件
   */
  switchChange: function(e) {
    if (e.currentTarget.dataset.sjlx == 1) {
      this.setData({
        rzsj: e.detail.value ? ' 20:00:00' : ' 22:00:00'
      })
    } else if (e.currentTarget.dataset.sjlx == 2) {
      this.setData({
        tfsj: e.detail.value ? ' 12:00:00' : ' 10:00:00'
      })
    } 
  },

  /**
   * 跳转到房间详情界面
   */
  navigateToFjxq: function(e) {
    util.navigateTo('/pages/home/fjxq/fjxq?hotelid=' + e.currentTarget.dataset.hotelid, true);
  },

  /**
   * 联系客服
   */
  makePhoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.servicePhone,
    })
  },

  /**
   * 跳转链接
   */
  redirectTo: function(e) {
    let link = e.currentTarget.dataset.link;
    if (link) {
      wx.navigateTo({
        url: '/pages/home/webview/webview?link=' + link,
      })
    }
  },

  /**
   * 加载轮播图片列表
   */
  loadImages: function() {
    let params = {
      url: app.globalData.serverUrl + 'getHomeLinks',
      body: {
        sfxs: '1',
        xssjq: util.dateUtil.format(new Date(), 'Y-M-D H:F:S'),
        xssjz: util.dateUtil.format(new Date(), 'Y-M-D H:F:S')
      }
    }
    let that = this;
    request.doRequest(
      params,
      function(data) {
        that.setData({
          ImageList: data
        })
      },
      function(data) {
        wx.showToast({
          title: '请求错误',
          icon: 'none'
        })
      }
    )
  },

  /**
   * 定位
   */
  getLocation: function() {
    var that = this;
    if (!app.globalData.user.address.address) {
      app.getLocation(function() {
        that.setData({
          myLocation: app.globalData.user.address.address
        })
        that.loadTjfy();
      });
    } else {
      that.setData({
        myLocation: app.globalData.user.address.address
      })
      that.loadTjfy();
    }
  },

  /**
   * 加载推荐房源
   */
  loadTjfy: function() {
    let params = {
      url: app.globalData.serverUrl + 'getHotels',
      body: {
        city: app.globalData.user.address.city,
        status: '1'
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        that.setData({
          tjfyList: data
        })
      },
      function (data) {
        wx.showToast({
          title: '请求错误',
          icon: 'none'
        })
      }
    )
  },

  /**
   * 选择时间
   */
  selectTime: function(e) {
    let index = e.currentTarget.dataset.index;
    if (index < this.data.timeIndex1) {
      return;
    }
    if (index == this.data.timeIndex1) {
      var times = this.data.timeList;
      times[this.data.timeIndex1].selected = '';
      this.setData({
        timeIndex1: -1,
        timeList: times
      })
      return;
    }
    if (this.data.timeIndex1 == -1) {
      this.setData({
        timeIndex1: index
      })
    } else {
      this.setData({
        timeIndex2: index
      })
    }
    var times = this.data.timeList;
    if (this.data.timeIndex2 == -1) {
      for (var i = 0; i < times.length; i++) {
        if (i == this.data.timeIndex1) {
          times[i].selected = 'time-selected';
        } else {
          times[i].selected = '';
        }
      }
    } else {
      for (var i = 0; i < times.length; i++) {
        if (i >= this.data.timeIndex1 && i <= this.data.timeIndex2) {
          times[i].selected = 'time-selected';
        } else {
          times[i].selected = '';
        }
      }
    }
    this.setData({
      timeList: times,
    })
    if (this.data.timeIndex2 != -1) {
      // 睡眠3秒
      let start = new Date().getTime();
      while (true) if (new Date().getTime() - start > 1000) break;
      this.setData({
        showTimeModal: false,
        rzsj: ' ' + this.data.timeList[this.data.timeIndex1].time + ':00',
        tfsj: ' ' + this.data.timeList[this.data.timeIndex2].time + ':00',
        rzrq: this.data.timeList[this.data.timeIndex1].day,
        tfrq: this.data.timeList[this.data.timeIndex2].day,
        rzsjDate: this.data.timeList[this.data.timeIndex1].date,
        ldsjDate: this.data.timeList[this.data.timeIndex2].date,
        rzsjWeek: this.data.timeList[this.data.timeIndex1].dateWeek,
        ldsjWeek: this.data.timeList[this.data.timeIndex2].dateWeek,
        rzxs: this.data.timeIndex2 - this.data.timeIndex1
      })
    }
  },

  // 初始化时间列表
  initTimeList: function() {
    var currentHour = util.dateUtil.format(new Date(), 'h');
    var currentday = util.dateUtil.format(new Date(), 'M月D日');
    var date = new Date();
    var times = [];
    for (var i = 0; i < 12; i++) {
      // 如果时间超过24小时，增加一天，时间重置为1
      if (currentHour > 24) {
        currentday = util.dateUtil.format(util.dateUtil.nextDay(new Date()), 'M月D日');
        date = util.dateUtil.nextDay(new Date());
        currentHour = 1;
      }
      times[i] = {
        time: util.dateUtil.formatNum(currentHour) + ':00',
        day: currentday,
        selected: '',
        date: util.dateUtil.format(date, 'Y-M-D'),
        dateWeek: util.dateUtil.getDetail(date).weekday
      }
      currentHour++;
    }
    this.setData({
      timeList: times,
      currentDay: util.dateUtil.format(new Date(), 'M月D日'),
      nextDay: currentday
    })
  }
})