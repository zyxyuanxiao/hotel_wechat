// pages/personal/personal.js
const util = require('../../utils/util.js')
const request = require('../../utils/request.js')
//获取应用实例
const app = getApp()

Page({

  data: {
    defaultUserImg: '/resources/images/user/default-user.png',
    vipImg: '/resources/images/user/vip.png',
    cardImg: '/resources/images/user/atm-card.png',
    scoreImg: '/resources/images/user/score.png',
    moneyImg: '/resources/images/user/score.png',
    couponImg: '/resources/images/user/score.png',
    rightArrowImage: '/resources/images/right-arr.png',
    userInfo: {},
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的', //导航栏 中间的标题
    },
  },

  onLoad: function() {

  },

  onShow: function() {
    var that = this;
    wx.getStorage({
      key: 'isLogin',
      success: function(res) {
        if (res.data) {
          wx.getStorage({
            key: 'userInfo',
            success: function(res) {
              that.setData({
                userInfo: res.data
              })
            },
          })
          wx.getStorage({
            key: 'vipInfo',
            success: function (res) {
              that.setData({
                vipInfo: res.data,
                routers: [{
                  name: '发票',
                  url: '/pages/personal/fptx/fptx',
                  icon: '/resources/images/user/fp.png',
                  index: '0'
                },
                {
                  name: '押金',
                  icon: '/resources/images/user/yj.png',
                  index: '1',
                  isWarn: true
                },
                {
                  name: '身份认证',
                  url: '/pages/personal/sfrz/sfrz',
                  icon: '/resources/images/user/sfrz.png',
                  index: '2',
                  isWarn: res.data.sfrz == '0' ? true : false
                },
                {
                  name: '常用入住人',
                  url: '/pages/personal/cyrzr/cyrzr',
                  icon: '/resources/images/user/cyrzr.png',
                  index: '3'
                },
                {
                  name: '长租申请',
                  url: '/pages/personal/czsq/czsq',
                  icon: '/resources/images/user/czsq.png',
                  index: '4'
                },
                {
                  name: '加盟申请',
                  url: '/pages/personal/jmsq/jmsq',
                  icon: '/resources/images/user/jmsq.png',
                  index: '5'
                },
                {
                  name: '联系客服',
                  icon: '/resources/images/user/lxkf.png',
                  index: '6'
                },
                {
                  name: '加入我们',
                  icon: '/resources/images/user/jrwm.png',
                  index: '7'
                },
                {
                  name: '设置',
                  icon: '/resources/images/user/settings.png',
                  index: '8'
                }
                ],
              })
              that.loadUserInfo();
            },
          })
        }
      },
    })
  },

  /**
   * 切换到在住服务tab页
   */
  navigateToZzfw: function() {
    wx.switchTab({
      url: '/pages/service/service',
    })
  },

  /**
   * 跳转到钱包界面
   */
  navigateToMoney: function() {
    util.navigateTo('/pages/personal/money/money', true);
  },

  /**
   * 跳转到优惠券界面
   */
  navigateToCoupon: function() {
    util.navigateTo('/pages/personal/coupon/coupon', true);
  },

  /**
   * 跳转九宫格服务
   */
  navigateService: function(e) {
    let index = e.detail.index;

    if (index == 6) {
      // 联系客服
      wx.makePhoneCall({
        phoneNumber: app.globalData.servicePhone,
      })
    } else if (!this.data.routers[index].url) {
      wx.showToast({
        title: '此功能暂未开通',
        icon: 'none'
      })
    } else {
      util.navigateTo(this.data.routers[index].url, true);
    }
  },

  /**
   * 登录
   */
  login: function() {
    app.getUserInfo(function() {
      // 跳转登录界面
      wx.navigateTo({
        url: '/pages/personal/login/login'
      })
    });
  },

  /**
   * 加载用户信息
   */
  loadUserInfo: function() {
    console.log(this.data.userInfo)
    var that = this;
    let params = {
      url: app.globalData.serverUrl + 'getVipInfo',
      body: {
        id: this.data.vipInfo.id
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