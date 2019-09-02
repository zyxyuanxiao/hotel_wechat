// pages/service/zzfw/zzfw.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    znsbRoutes: [{
      name: '智能开门',
      icon: '/resources/images/service/click.png',
      index: '0'
    }, {
      name: '密码开门',
      icon: '/resources/images/service/password.png',
      index: '1'
    }, {
      name: '人脸开门',
      icon: '/resources/images/service/rlsb.png',
      index: '2'
    }, {
      name: '其他设备',
      icon: '/resources/images/service/sfz.png',
      index: '3'
    },],
    zzfwRouters: [{
      name: '联系酒店',
      icon: '/resources/images/service/lxkf.png',
      index: '0'
    },
    {
      name: '邀请入住',
      url: '/pages/personal/yj/yj',
      icon: '/resources/images/service/yqrz.png',
      index: '1'
    },
    {
      name: '办理退房',
      icon: '/resources/images/service/bltf.png',
      index: '2'
    },
    {
      name: '办理续住',
      icon: '/resources/images/service/blxz.png',
      index: '3'
    },
    {
      url: '/pages/service/sqqj/sqqj',
      name: '清洁服务',
      icon: '/resources/images/service/qjfw.png',
      index: '4'
    },
    {
      name: '意见反馈',
      icon: '/resources/images/service/yjfk.png',
      index: '5'
    },
    {
      name: '寻路指南',
      icon: '/resources/images/service/xlzn.png',
      index: '6'
    },
    {
      name: '门店提醒',
      icon: '/resources/images/service/mdtx.png',
      index: '7'
    },
    {
      name: '在线客服',
      icon: '/resources/images/service/zxkf.png',
      index: '8'
    }
    ],
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '服务', //导航栏 中间的标题
      back: true
    },
    clickMaskClose: false,
    hideContinue: true,
    showCalendarModal: false,
    showTimeModal: false,
    rzts: 0,
    rzxs: 0, zffsRadio: [
      { value: '1', name: '钱包支付' },
      { value: '2', name: '微信支付' }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderid
    })
    // 获取vip信息
    var that = this;
    wx.getStorage({
      key: 'vipInfo',
      success: function (res) {
        that.setData({
          qbye: res.data.qbye,
          vipid: res.data.id
        });
      },
    });
    this.loadOrder();
  },

  /**
   * 点击在住服务项
   */
  clickZzfwItem: function (e) {
    let index = e.detail.index;
    if (index == 0) {
      // 联系客服
      wx.makePhoneCall({
        phoneNumber: '0719-8885855',
      })
    } else if (index == 1) { // 邀请入住
      wx.showToast({
        title: '暂未开通',
        icon: 'none'
      })
    } else if (index == 2) {  // 退房
      this.checkOut();
    } else if (index == 3) { // 续住
      this.setData({
        hideContinue: false
      })
    } else if (this.data.zzfwRouters[index].url) {
      wx.navigateTo({
        url: this.data.zzfwRouters[index].url,
      })
    } else {
      wx.showToast({
        title: '暂未开通',
        icon: 'none'
      })
    }
  },

  /**
   * 点击智能开门
   */
  clcikZnkm: function(e) {
    let index = e.detail.index;
    if (index == 0) {
      console.log('智能开门');
    } else if (index == 1) {
      console.log('密码开门');
    } else if (index == 3) {
      util.navigateTo('/pages/service/kksb/kksb', true);
    } else {
      wx.showToast({
        title: '暂未开通',
        icon: 'none'
      })
    }
  },

  /**
   * 选择支付方式
   */
  radioChange: function (e) {
    this.setData({
      zffs: e.detail.value
    })
  },

  /**
   * 取消续住
   */
  cancelContinue: function() {
    this.setData({
      hideContinue: true
    })
  },

  selectLdrq: function() {
    if (this.data.orderInfo.rzlx == '3') {
      this.setData({
        showTimeModal: true
      })
    } else {
      this.setData({
        showCalendarModal: true
      })
    }
  },

  unSelectRzsj: function() {
    if (this.data.orderInfo.rzlx == '3') {
      this.setData({
        showTimeModal: false
      })
    } else {
      this.setData({
        showCalendarModal: false
      })
    }
  },

  /**
   * 处理选择日期
   */
  handleSelectDate: function(e) {
    console.log(e.detail)
    this.setData({
      showCalendarModal: false,
      ldrq: this.formaDate(e.detail) + ' 12:00:00',
      rzts: util.dateUtil.dateDiff(this.formaDate(e.detail) + ' 12:00:00', this.data.orderInfo.ldsj)
    });
    this.validateContinue();
  },

  formaDate: function (date) {
    return util.dateUtil.formatNum(date.year) + '-' + util.dateUtil.formatNum(date.month) + '-' + util.dateUtil.formatNum(date.day)
  },

  /**
   * 加载订单信息
   */
  loadOrder: function() {
    let params = {
      url: app.globalData.serverUrl + 'getOrder',
      body: {
        orderid: this.data.orderid
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        that.setData({
          orderInfo: data.orderInfo,
        })
        that.initTimeList();
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
  selectTime: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      showTimeModal: false,
      ldrq: this.data.timeList[index].date + ' ' + this.data.timeList[index].time + ':00',
      rzxs: Number(this.data.timeList[index].time.substring(0, 2)) - 
        Number(this.data.orderInfo.ldsj.substring(11, 13))
    })
    this.validateContinue();
  },

  // 初始化时间列表
  initTimeList: function () {
    var currentHour = util.dateUtil.format(new Date(this.data.orderInfo.ldsj), 'h');
    var currentday = util.dateUtil.format(new Date(this.data.orderInfo.ldsj), 'M月D日');
    var date = new Date(this.data.orderInfo.ldsj);
    var times = [];
    for (var i = 0; i < 12; i++) {
      // 如果时间超过24小时，增加一天，时间重置为1
      if (currentHour > 24) {
        currentday = util.dateUtil.format(util.dateUtil.nextDay(new Date(this.data.orderInfo.ldsj)), 'M月D日');
        date = util.dateUtil.nextDay(new Date(this.data.orderInfo.ldsj));
        currentHour = 1;
      }
      times[i] = {
        time: util.dateUtil.formatNum(currentHour) + ':00',
        day: currentday,
        date: util.dateUtil.format(date, 'Y-M-D'),
      }
      currentHour++;
    }
    this.setData({
      timeList: times,
      currentDay: util.dateUtil.format(new Date(this.data.orderInfo.ldsj), 'M月D日'),
      nextDay: currentday
    })
  },

  /**
   * 校验是否可以办理续住
   */
  validateContinue: function() {
    let params = {
      url: app.globalData.serverUrl + 'validateContinue',
      body: {
        orderid: this.data.orderid,
        rzsj: this.data.orderInfo.ldsj,
        ldsj: this.data.ldrq,
        rzts: this.data.rzts,
        rzxs: this.data.rzxs
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        console.log(data)
        if (data.code != '1') {
          wx.showModal({
            title: '温馨提示',
            content: data.message,
            confirmText: "确定", //默认是“确定”
            showCancel: false,//是否显示取消按钮
            confirmColor: 'skyblue',//确定文字的颜色
            success: function (res) {
              that.setData({
                hideContinue: true,
                ldrq: ''
              })
            }
          })
        } else {
          that.setData({
            fjjg: data.o_price,
            ddyj: data.o_ddjg,
            yfje: data.o_ddjg
          })
        }
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
   * 保存续住信息
   */
  saveContinue: function() {
    if (!this.data.zffs) {
      wx.showToast({
        title: '请选择支付方式',
        icon: 'none'
      })
      return;
    }
    if (this.data.zffs == '1' && this.data.qbye < this.data.yfje) {
      wx.showToast({
        title: '钱包余额不足',
        icon: 'none'
      })
      return;
    }

    let params = {
      url: app.globalData.serverUrl + 'saveContinue',
      body: {
        orderid: this.data.orderid,
        rzsj: this.data.orderInfo.ldsj,
        ldsj: this.data.ldrq,
        fjjg: this.data.fjjg,
        ddyj: this.data.ddyj,
        yfje: this.data.yfje,
        rzts: this.data.rzts,
        rzxs: this.data.rzxs,
        zffs: this.data.zffs
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
         if (that.zffs == '2') {
           // 发起微信支付
           var params = {};
           params['data'] = {
             total_fee: that.data.yfje * 100,
             paytype: '1',
             desc: '锦恒科技-房费',
             vipid: that.data.vipid
           }

           let requestParam = {
             url: app.globalData.serverUrl + 'updateOrder',
             body: {
               id: data,
               sfje: that.data.yfje,
               ddzt: '3'
             }
           }
           // 支付成功回调函数
           params['successFun'] = function (wechatpayid) {
             requestParam.body['wechatpayid'] = wechatpayid;
             request.doRequest(
               requestParam,
               function (data) {
                 wx.showToast({
                   title: '续住成功',
                   icon: 'none',
                 })
                 this.setData({
                   hideContinue: true
                 })
               },
               function (data) {
                 wx.showToast({
                   title: '服务器异常',
                   icon: 'none'
                 })
               }
             )
           }
           // 支付失败回调函数
           params['failFun'] = function () {
             wx.showModal({
               title: '温馨提示',
               content: '订单尚未支付，请尽快支付',
               showCancel: false,
               success: function () {
                 this.setData({
                   hideContinue: true
                 })
               }
             })
           }
           payUtil.payUtil.pay(params);
         } else {
           wx.showToast({
             title: '续住成功',
             icon: 'none'
           })
           this.setData({
             hideContinue: true
           })
         }
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
   * 退房
   */
  checkOut: function() {
    
  }
})