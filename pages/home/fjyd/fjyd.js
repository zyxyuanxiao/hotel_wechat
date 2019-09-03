// pages/home/fjyd/fjyd.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
const payUtil = require('../../../utils/wxpay.js')
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
    yhqid: 1,
    yhqje: 20,
    startDate: util.dateUtil.format(new Date(), 'Y-M-D'),
    endDate: util.dateUtil.format(util.dateUtil.nextMonth(new Date(), 3), 'Y-M-D'),
    rmbImage: '/resources/images/user/rmb.png',
    circleImage: '/resources/images/circle.png',
    selectedImage: '/resources/images/success-filling.png',
    couponList: [],
    rzrxm1: '',
    rzrsjhm1: '',
    rzrxm2: '',
    rzrsjhm2: '',
    rzxs: 0,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '预定', //导航栏 中间的标题
      back: true
    },
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
        rztsNum: this.data.ydsj.rztsNum,
        rzxs: this.data.ydsj.rzxs
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
    // 获取vip信息
    var that = this;
    wx.getStorage({
      key: 'vipInfo',
      success: function (res) {
        that.setData({
          qbye: res.data.qbye,
          vipid: res.data.id,
          hydj: res.data.hydj,
          xm: res.data.xm
        });
        // 加载优惠券列表
        that.loadCoupon();
        if (options.hotel) {
          // 设置酒店信息
          that.setData({
            fjlxid: options.fjlxid,
            hotel: JSON.parse(options.hotel)
          });
          // 加载酒店房型信息
          that.loadFjlxxx();
          // 加载剩余房间数
          that.loadSyfjs();
        } else if (options.orderid) {
          // 如果存在orderid则说明为再次预定或者续住
          that.loadOrderInfo(options.orderid);
        }
      },
    });
  },

  /**
   * 用户选择入住时间
   */
  selectRzsj: function () {
    if (this.data.rzlx != '1') {
      return;
    }
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
    });
    // 计算订单价格
    this.computeRoomPrice();

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
    // 计算订单价格
    this.computeRoomPrice();
  },

  /**
   * 加载房间类型信息
   */
  loadFjlxxx: function(e) {
    let params = {
      url: app.globalData.serverUrl + 'getRoomPrice',
      body: {
        id: this.data.fjlxid,
        vipid: this.data.vipid,
        pricetype: this.data.hydj == '1' ? 'A' : 'B'
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        that.setData({
          fjlx: data.fjlx,
        })
        that.computeRoomPrice();
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
          rzrxm1: res.data.xm,
          rzrsjhm1: res.data.sjhm,
          rzrlx: '1'
        });
      },
    })
  },

  /**
   * 选择入住人
   */
  selectRzr: function() {
    wx.navigateTo({
      url: '/pages/personal/cyrzr/cyrzr?showSelect=true&maxNum=2',
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
      rzrsjhm1: e.detail.value
    })
  },

  /**
   * 输入姓名
   */
  inputXm: function (e) {
    this.setData({
      rzrxm1: e.detail.value
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
                ddyj: 0,
                yfje: 0
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
    if (this.data.ddyj == 0) {
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
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
    if (!this.data.rzrxm1) {
      wx.showToast({
        title: '入住人不能为空',
        icon: 'none'
      })
      return;
    }
    if (!this.data.rzrsjhm1) {
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
    if (this.data.zffs == '1' && this.data.qbye < this.data.yfje) {
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
        ddyj: this.data.ddyj,
        ysje: this.data.yfje,
        sfje: this.data.zffs == '1' ? this.data.yfje : 0,   // 支付方式为钱包支付
        rzlx: this.data.rzlx == undefined ? '1' : this.data.rzlx,
        rzrid: this.data.rzrid,
        rzrlx: this.data.rzrlx,
        xdrid: this.data.vipid,
        rzrxm1: this.data.rzrxm1,
        rzrsjhm1: this.data.rzrsjhm1,
        rzrid1: this.data.rzrid1,
        rzrxm2: this.data.rzrxm2,
        rzrsjhm2: this.data.rzrsjhm2,
        rzrid2: this.data.rzrid2,
        zffs: this.data.zffs,
        fjs: this.data.fjs,
        memo: this.data.memo == undefined ? '' : this.data.memo,
        ddzt: this.data.zffs == '1' ? '2' : '1',
        yhqid: this.data.yhqid,
        yhqje: this.data.yhqje,
        yhje: 0,
        ddly: '1',
        fjyj: this.data.fjjg,
        sjjg: this.data.fjjg,
        xdrxm: this.data.xm,
        pricetype: this.data.hydj == '1' ? 'A' : 'B',
        rzxs: this.data.rzxs
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        wx.hideLoading({
          title: '加载中',
        })
        // 如果支付方式为钱包支付，则直接预定成功
        if (that.data.zffs == '1') {
          wx.showToast({
            title: '预定成功',
            icon: 'none',
            success: function() {
              wx.switchTab({
                url: '/pages/order/order',
              })
            }
          })
          // 重新加载用户信息，刷新钱包余额
          that.loadUserInfo();
        } else {
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
              ddzt: '2'
            }
          }
          // 支付成功回调函数
          params['successFun'] = function (wechatpayid) {
            requestParam.body['wechatpayid'] = wechatpayid;
            request.doRequest(
              requestParam,
              function (data) {
                wx.showToast({
                  title: '预定成功',
                  icon: 'none',
                  success: function () {
                    wx.switchTab({
                      url: '/pages/order/order',
                    })
                  }
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
          params['failFun'] = function() {
            wx.showModal({
              title: '温馨提示',
              content: '订单尚未支付，请尽快支付，否则半小时后订单将自动取消',
              showCancel: false,
              success: function () {
                wx.switchTab({
                  url: '/pages/order/order',
                })
              }
            })
          }

          payUtil.payUtil.pay(params);
        }
      },
      function (data) {
        wx.showToast({
          title: '服务器异常',
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
      yhqje: this.data.couponList[e.currentTarget.dataset.index].yhqje,
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
        if (data.length == 0) {
          that.setData({
            couponList: data,
            selectCouponIndex: 0,
            yhqje: 0
          })
        } else {
          that.setData({
            couponList: data,
            selectCouponIndex: 0,
            yhqje: data[0].yhqje
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
   * 再次预定时加载订单信息
   */
  loadOrderInfo: function(orderid) {
    let params = {
      url: app.globalData.serverUrl + 'getOrder',
      body: {
        orderid: orderid,
        pricetype: this.data.hydj == '1' ? 'A' : 'B'
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        that.setData({
          hotel: data.hotel,
          fjlxid: data.hotel.fxid,
          fjlx: data.hotel.fjlx,
          rzrxm: data.orderInfo.rzrxm,
          rzrsjhm: data.orderInfo.rzrsjhm,
        })
        that.setData({
          zffsRadio: [
            { value: '1', name: '钱包支付', checked: data.orderInfo.zffs == '1' ? true : false },
            { value: '2', name: '微信支付', checked: data.orderInfo.zffs == '2' ? true : false }
          ],
        })
        // 计算订单价格
        that.computeRoomPrice();
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
  },

  /**
   * 计算应付金额
   */
  computeRoomPrice: function() {
    let params = {
      url: app.globalData.serverUrl + 'computeRoomPrice',
      body: {
        i_pricetype: this.data.hydj == '1' ? 'A' : 'B',
        i_fxid: this.data.fjlxid,
        i_rzlx: this.data.rzlx,
        i_rzsj: this.data.rzsjDate + this.data.rzsj,
        i_ldsj: this.data.ldsjDate + this.data.tfsj,
        i_rzts: this.data.rztsNum,
        i_rzhour: this.data.rzxs
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        if (data.o_price == undefined || data.o_price == '') {
          wx.showModal({
            title: '温馨提示',
            content: '未设置房间价格，请联系酒店管理员',
            showCancel: false,
          })
        }
        that.setData({
          pricetype: data.o_pricetype,
          fjjg: data.o_price,
          ddyj: data.o_ddjg,
          yfje: data.o_ddjg - that.data.yhqje
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
   * 加载用户信息
   */
  loadUserInfo: function () {
    console.log(this.data.userInfo)
    var that = this;
    let params = {
      url: app.globalData.serverUrl + 'getVipInfo',
      body: {
        id: this.data.vipid
      }
    }

    request.doRequest(
      params,
      function (data) {
        data.qbye = util.parseDouble(data.qbye);
        wx.setStorage({
          key: 'vipInfo',
          data: data,
        })
        that.setData({
          vipInfo: data
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