// pages/home/fjyd/fjyd.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    clickMaskClose: false,
    calendarImage: '/resources/images/home/calendar.png',
    wjxIcon: '/resources/images/wjx.png',
    wjxFillingIcon: '/resources/images/wjx_filling.png',
    user_plus: '/resources/images/service/yqrz.png',
    zffsRadio: [
      { value: '1', name: '钱包支付' },
      { value: '2', name: '微信支付' }
    ],
    fjs: 1,
    xychecked: false,
    hyzk: 9,
    yhqid: 1,
    yhqje: 20,
    startDate: util.dateUtil.format(new Date(), 'Y-M-D'),
    endDate: util.dateUtil.format(util.dateUtil.nextMonth(new Date(), 3), 'Y-M-D'),
    rmbImage: '/resources/images/user/rmb.png',
    circleImage: '/resources/images/circle.png',
    selectedImage: '/resources/images/success-filling.png',
    couponList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 如果存在入住时间则设置入住时间
    if (options.ydsj) {
      this.setData({
        ydsj: JSON.parse(options.ydsj)
      });
      console.log(this.data.ydsj);
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
        rztsNum: 1,
        rzsjDate: util.dateUtil.format(new Date(), 'Y-M-D'),
        ldsjDate: util.dateUtil.format(util.dateUtil.nextDay(), 'Y-M-D'),
        rzlx: '1',
        rzsj: ' 14:00:00',
        tfsj: ' 12:00:00'
      })
    }

    if (options.hotel) {
      // 设置酒店信息
      this.setData({
        fjlxid: options.fjlxid,
        hotel: JSON.parse(options.hotel)
      });
      // 加载酒店房型信息
      this.loadFjlxxx();
      // 加载剩余房间数
      this.loadSyfjs();
    }
  
    // 如果存在orderid则说明为再次预定或者续住
    if (options.orderid) {
      this.loadOrderInfo(options.orderid);
    }

    // 获取vip信息
    var that = this;
    wx.getStorage({
      key: 'vipInfo',
      success: function (res) {
        that.setData({
          qbye: util.parseDouble(res.data.qbye),
          vipid: res.data.id
        });
        // 加载优惠券列表
        that.loadCoupon();
      },
    });
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
   * 取消选择日期
   */
  unSelectRzsj: function() {
    this.setData({
      showModal: false
    })
  },

  // 处理日期选择事件
  handleSelectDate(e) {
    let dateStart = e.detail.dateStart;
    let dateEnd = e.detail.dateEnd;
    let rzts = util.dateUtil.dateDiff(this.formaDate(dateEnd), this.formaDate(dateStart));
    console.log(rzts + "," + this.data.fjjg + "," + this.data.fjs);
    this.setData({
      ddyj: util.parseDouble(rzts * this.data.fjjg * this.data.fjs),
      rztsNum: rzts,
      showModal: false,
      rzrq: util.dateUtil.formatNum(dateStart.month) + '月' + util.dateUtil.formatNum(dateStart.day) + '日',
      tfrq: util.dateUtil.formatNum(dateEnd.month) + '月' + util.dateUtil.formatNum(dateEnd.day) + '日',
      rzts: util.dateUtil.convertToChinaNum(rzts) + '天',
      rzsjDate: this.formaDate(dateStart),
      ldsjDate: this.formaDate(dateEnd),
      rzsjWeek: util.dateUtil.getDetail(util.dateUtil.parse(this.formaDate(dateStart), 'y-m-d')).weekday,
      ldsjWeek: util.dateUtil.getDetail(util.dateUtil.parse(this.formaDate(dateEnd), 'y-m-d')).weekday,
    });
    // 计算实付金额
    this.setData({
      sfje: util.parseDouble(this.data.ddyj * this.data.hyzk / 10 - this.data.yhqje)
    })
    this.loadSyfjs();
  },

  // 格式化日期
  formaDate: function (date) {
    return util.dateUtil.formatNum(date.year) + '-' + util.dateUtil.formatNum(date.month) + '-' + util.dateUtil.formatNum(date.day)
  },

  /**
   * 房间数减
   */
  bindFjslChange: function(e) {
    if (e.detail.num > this.data.freeRomms) {
      wx.showToast({
        title: '预定房间数不能超过剩余房间数',
        icon: 'none'
      })
      this.setData({
        fjs: this.data.freeRomms
      })
    } else {
      this.setData({
        fjs: e.detail.num
      })
    }
    console.log(this.data.rztsNum + "," + this.data.fjjg + "," + this.data.fjs)
    this.setData({
      ddyj: util.parseDouble(this.data.rztsNum * this.data.fjjg * this.data.fjs)
    })
    this.setData({
      sfje: util.parseDouble(this.data.ddyj * this.data.hyzk / 10 - this.data.yhqje)
    })
  },

  /**
   * 加载房间类型信息
   */
  loadFjlxxx: function(e) {
    let params = {
      url: app.globalData.serverUrl + 'getHomeType',
      body: {
        id: this.data.fjlxid
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        data.fjjg = util.parseDouble(data.fjjg);
        data.hyjg = util.parseDouble(data.hyjg);
        that.setData({
          fjjg: data.fjjg,
          hyjg: data.hyjg,
          fjlx: data.fjlx,
          ddyj: util.parseDouble(that.data.rztsNum * data.fjjg),
        })
        that.setData({
          sfje: util.parseDouble(that.data.ddyj * that.data.hyzk / 10 - that.data.yhqje),
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
   * 本人入住
   */
  brrz: function() {
    var that = this;
    wx.getStorage({
      key: 'vipInfo',
      success: function(res) {
        that.setData({
          rzrxm: res.data.xm,
          rzrsjhm: res.data.sjhm,
          rzrlx: '1',
          rzrid: res.data.id
        });
      },
    })
  },

  /**
   * 选择入住人
   */
  selectRzr: function() {
    wx.navigateTo({
      url: '/pages/personal/cyrzr/cyrzr?showSelect=true',
    })
  },

  /**
   * 输入备注
   */
  inputMemo: function(e) {
    this.setData({
      memo: e.detail.value
    })
  },

  /**
   * 输入手机号码
   */
  inputSjhm: function(e) {
    this.setData({
      rzrsjhm: e.detail.value
    })
  },

  /**
   * 输入姓名
   */
  inputXm: function (e) {
    this.setData({
      rzrxm: e.detail.value
    })
  },

  radioChange: function(e) {
    this.setData({
      zffs: e.detail.value
    })
  },

  /**
   * 加载剩余房间数
   */
  loadSyfjs: function() {
    let params = {
      url: app.globalData.serverUrl + 'getFreeRooms',
      body: {
        fxid: this.data.fjlxid,
        rzsj: this.data.rzsjDate + this.data.rzsj,
        ldsj: this.data.ldsjDate + this.data.tfsj
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        console.log(data);
        that.setData({
          freeRomms: data
        })
        if (data == 0) {
          wx.showModal({
            title: '温馨提示',
            content: '当前时间段内此房型暂无空闲房间，请选择其他房型',
            confirmText: "确定", //默认是“确定”
            showCancel: false,//是否显示取消按钮
            confirmColor: 'skyblue',//确定文字的颜色
            success: function (res) {
              that.setData({
                fjs: 0,
                ddyj: util.parseDouble(0),
                sfje: util.parseDouble(0)
              })
            }
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
   * 点击同意协议事件
   */
  checked: function() {
    this.setData({
      xychecked: !this.data.xychecked
    })
  },

  /**
   * 提交订单
   */
  orderRoom: function() {
    if (this.data.fjs == 0) {
      wx.showToast({
        title: '请输入房间数',
        icon: 'none'
      })
      return;
    }
    // 校验房间数
    if (this.data.fjs > this.data.freeRomms) {
      wx.showToast({
        title: '剩余房间不足',
        icon: 'none'
      })
      return;
    }
    // 校验比录项
    if (!this.data.rzrxm) {
      wx.showToast({
        title: '入住人不能为空',
        icon: 'none'
      })
      return;
    }
    if (!this.data.rzrsjhm) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    if (!this.data.zffs) {
      wx.showToast({
        title: '请选择支付方式',
        icon: 'none'
      })
      return;
    }
    if (this.data.zffs == '1' && this.data.qbye < this.data.sfje) {
      wx.showToast({
        title: '钱包余额不足',
        icon: 'none'
      })
      return;
    }
    if (!this.data.xychecked) {
      wx.showToast({
        title: '请阅读并同意租赁协议',
        icon: 'none'
      })
      return;
    }

    let params = {
      url: app.globalData.serverUrl + 'orderRoom',
      body: {
        fxid: this.data.fjlxid,
        rzsj: this.data.rzsjDate + this.data.rzsj,
        ldsj: this.data.ldsjDate + this.data.tfsj,
        rzts: this.data.rztsNum,
        ddyj: util.parseDouble(this.data.ddyj),
        sfje: util.parseDouble(this.data.sfje),
        rzlx: this.data.rzlx == undefined ? '1' : this.data.rzlx,
        rzrid: this.data.rzrid,
        rzrlx: this.data.rzrlx,
        xdrid: this.data.vipid,
        rzrxm: this.data.rzrxm,
        rzrsjhm: this.data.rzrsjhm,
        zffs: this.data.zffs,
        fjs: this.data.fjs,
        memo: this.data.memo == undefined ? '' : this.data.memo,
        ddzt: '1',
        yhqid: this.data.yhqid,
        yhqje: util.parseDouble(this.data.yhqje),
        hyzk: this.data.hyzk,
        hyzkje: util.parseDouble(this.data.ddyj * (10 - this.data.hyzk) / 10)
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        console.log(data);
        wx.showToast({
          title: '生成订单成功',
          icon: 'none',
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
   * 选择优惠券
   */
  showSelectCoupon: function() {
    this.setData({
      showYhqModal: true
    })
  },

  /**
   * 取消选择优惠券
   */
  unSelectCoupon: function() {
    this.setData({
      showYhqModal: false
    })
  },

  /**
   * 选择优惠券
   */
  selectCoupon: function (e) {
    this.setData({
      selectCouponIndex: e.currentTarget.dataset.index,
      showYhqModal: false,
      yhqid: this.data.couponList[e.currentTarget.dataset.index].id,
      yhqje: util.parseDouble(this.data.couponList[e.currentTarget.dataset.index].yhqje),
    });
  },

  /**
   * 加载优惠券列表
   */
  loadCoupon: function(e) {
    let params = {
      url: app.globalData.serverUrl + 'getCoupons',
      body: {
        userid: this.data.vipid,
        yhqzt: '1',
        yxqq: util.dateUtil.format(new Date(), 'Y-M-D H:F:S'),
        yxqz: util.dateUtil.format(new Date(), 'Y-M-D H:F:S')
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        console.log(data);
        that.setData({
          couponList: data,
          selectCouponIndex: 0,
          yhqje: util.parseDouble(data[0].yhqje)
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
   * 
   */
  loadOrderInfo: function(orderid) {
    let params = {
      url: app.globalData.serverUrl + 'getOrder',
      body: {
        orderid: orderid
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        console.log(data);
        that.setData({
          hotel: data.hotel,
          fjlxid: data.hotel.fxid,
          rzrxm: data.orderInfo.rzrxm,
          rzrsjhm: data.orderInfo.rzrsjhm,
        })
        if (data.orderInfo.zffs == '1') {
          that.setData({
            zffsRadio: [
              { value: '1', name: '钱包支付', checked: true },
              { value: '2', name: '微信支付' }
            ],
          })
        } else {
          that.setData({
            zffsRadio: [
              { value: '1', name: '钱包支付' },
              { value: '2', name: '微信支付', checked: true }
            ],
          })
        }
        // 加载酒店房型信息
        // that.loadFjlxxx();
        that.setData({
          fjjg: data.hotel.fjjg,
          hyjg: data.hotel.hyjg,
          fjlx: data.hotel.fjlx,
          ddyj: util.parseDouble(that.data.rztsNum * data.hotel.fjjg),
        })
        that.setData({
          sfje: util.parseDouble(that.data.ddyj * that.data.hyzk / 10 - that.data.yhqje),
        })

        // 加载剩余房间数
        that.loadSyfjs();
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