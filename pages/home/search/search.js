// pages/home/search/search.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,
    searchImage: '/resources/images/home/search_2.png',
    sxfyList: [],
    scrollTop: 100,
    roomListHeight: 100,
    tabList: [
      {
        index: 1,
        name: '挑选房间'
      }, {
        index: 2,
        name: '酒店特卖'
      }
    ],
    startDate: util.dateUtil.format(new Date(), 'Y-M-D'),
    endDate: util.dateUtil.format(util.dateUtil.nextMonth(new Date(), 3), 'Y-M-D'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      roomListHeight: wx.getSystemInfoSync().windowHeight - 101.5,
      cityName: app.globalData.user.address.city
    })
    // 如果存在入住时间则设置入住时间
    if (options.ydsj) {
      this.setData({
        ydsj: JSON.parse(options.ydsj)
      });
      this.setData({
        rzrq: this.data.ydsj.rzrq,
        tfrq: this.data.ydsj.tfrq,
        rzts: this.data.ydsj.rzts,
        rzsjDate: this.data.ydsj.rzsjDate,
        ldsjDate: this.data.ydsj.ldsjDate,
        rzsjWeek: this.data.ydsj.rzsjWeek,
        ldsjWeek: this.data.ydsj.ldsjWeek,
        rzlx: this.data.ydsj.rzlx,
        rzsj: this.data.ydsj.rzsj,
        tfsj: this.data.ydsj.tfsj,
        rztsNum: this.data.ydsj.rztsNum
      })
    } else {
      this.setData({
        rzrq: util.dateUtil.format(new Date(), 'M月D'),
        tfrq: util.dateUtil.format(util.dateUtil.nextDay(), 'M月D'),
        rzsjWeek: util.dateUtil.getDetail(new Date()).weekday,
        ldsjWeek: util.dateUtil.getDetail(util.dateUtil.nextDay()).weekday,
        rzts: '一天',
        rzsjDate: util.dateUtil.format(new Date(), 'Y-M-D'),
        ldsjDate: util.dateUtil.format(util.dateUtil.nextDay(), 'Y-M-D'),
        rzlx: '1',
        rztsNum: 1,
        rzsj: ' 14:00:00',
        tfsj: ' 12:00:00'
      })
    }
    this.loadSxfy({
      detail: {
        conditions: ''
      }
    });
    // 加载城市信息
    this.loadArea();
  },

  /**
   * 切换tab页
   */
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
   * 跳转到房间详情界面
   */
  navigateToFjxq: function(e) {
    var params = {
      rzrq: this.data.rzrq,
      tfrq: this.data.tfrq,
      rzts: this.data.rzts,
      rzsjDate: this.data.rzsjDate,
      ldsjDate: this.data.ldsjDate,
      rzsjWeek: this.data.rzsjWeek,
      ldsjWeek: this.data.ldsjWeek,
      rzlx: this.data.rzlx,
      rzsj: this.data.rzsj,
      tfsj: this.data.tfsj,
      rztsNum: this.data.rztsNum
    }
    wx.navigateTo({
      url: '/pages/home/fjxq/fjxq?ydsj=' + JSON.stringify(params) + '&hotelid=' + e.currentTarget.dataset.hotelid,
    })
  },

  /**
   * 加载推荐房源
   */
  loadSxfy: function (e) {
    let params = {
      url: app.globalData.serverUrl + 'getHotels',
      body: {
        conditions: e.detail.conditions,
        status: '1'
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        that.setData({
          sxfyList: data
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
   * 用户选择入住时间
   */
  selectRzsj: function () {
    this.setData({
      showModal: true
    })
  },

  /**
   * 取消选择入住时间
   */
  unSelectRzsj: function () {
    this.setData({
      showModal: false
    })
  },

  // 处理日期选择事件
  handleSelectDate(e) {
    let dateStart = e.detail.dateStart;
    let dateEnd = e.detail.dateEnd;
    let rzts = util.dateUtil.dateDiff(this.formaDate(dateEnd), this.formaDate(dateStart));
    this.setData({
      rztsNum: rzts,
      showModal: false,
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
  formaDate: function (date) {
    return util.dateUtil.formatNum(date.year) + '-' + util.dateUtil.formatNum(date.month) + '-' + util.dateUtil.formatNum(date.day)
  },

  /**
   * 显示
   */
  showCity: function() {
    wx.navigateTo({
      url: '/pages/home/selectcity/selectcity',
    })
  },

  /**
   * 加载城市区划信息
   */
  loadArea: function() {
    let params = {
      url: app.globalData.serverUrl + 'getXzqhs',
      body: {
        parentname: this.data.cityName
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        that.setData({
          areaList: data
        })
      },
      function (data) {
        wx.showToast({
          title: '请求错误',
          icon: 'none'
        })
      }
    )
  }
})