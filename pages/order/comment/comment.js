// pages/order/comment/comment.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circleImage: '/resources/images/circle.png',
    selectedImage: '/resources/images/success-filling.png',
    isSelected: false,   //是否全选
    plxsDesc: '显示评价时会展示您的姓名呦',  //评论展示描述
    zhpf: 0,
    sspf: 0,
    wspf: 0,
    aqg: 0,
    comment: '',
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '评论', //导航栏 中间的标题
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ddid: options.orderid,
      jdid: options.jdid
    });

    var that = this;
    wx.getStorage({
      key: 'vipInfo',
      success: function (res) {
        if (res.data) {
          that.setData({
            vipid: res.data.id
          })
        } else {
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          })
        }
      },
    })
  },

  /**
   * 选择匿名评论
   */
  select: function() {
    this.setData({
      isSelected: !this.data.isSelected,
      plxsDesc: this.data.isSelected ? '展示评价时会展示您的姓名呦' : '你写的评价会以匿名的形式展现'
    })
  },

  /**
   * 综合评分
   */
  zhpf: function(e) {
    this.setData({
      zhpf: e.detail.star
    })
  },

  /**
   * 设施评分
   */
  sspf: function (e) {
    this.setData({
      sspf: e.detail.star
    })
  },

  /**
   * 卫生评分
   */
  wspf: function (e) {
    this.setData({
      wspf: e.detail.star
    })
  },

  /**
   * 安全感
   */
  aqg: function (e) {
    this.setData({
      aqg: e.detail.star
    })
  },

  /**
   * 输入评论内容
   */
  inputComment: function(e) {
    this.setData({
      comment: e.detail.value
    })
  },

  /**
   * 发布评价
   */
  fbpj: function() {
    let params = {
      url: app.globalData.serverUrl + 'addComment',
      body: {
        ddid: this.data.ddid,
        plrid: this.data.vipid,
        sspf: this.data.sspf,
        wspf: this.data.wspf,
        aqg: this.data.aqg,
        zhpf: this.data.zhpf,
        pjnr: this.data.comment,
        sfnm: this.data.isSelected ? '1' : '0',
        jdid: this.data.jdid
      }
    }

    let that = this;
    request.doRequest(
      params,
      function (data) {
        wx.showModal({
          title: '温馨提示',
          content: '发布评论成功',
          confirmText: "确定", //默认是“确定”
          showCancel: false,//是否显示取消按钮
          confirmColor: 'skyblue',//确定文字的颜色
          success: function (res) {
            if (res.confirm) {
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];  //上一个页面

              prevPage.loadOrders('4');
              wx.navigateBack({
                url: '/pages/order/order'
              })
            }
          }
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