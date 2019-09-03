// pages/personal/cyrzr/cyrzr.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cyrzrList: [],
    showSelect: false,
    selectCyrzrIndex: -1,
    circleImage: '/resources/images/circle.png',
    selectedImage: '/resources/images/success-filling.png',
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '常用入住人', //导航栏 中间的标题
      back: true
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.showSelect != undefined) {
      this.setData({
        showSelect: true,
        maxNum: options.maxNum
      })
    }
  },

  /**
   * 加载入住人列表
   */
  onShow: function() {
    // 获取vip信息
    var that = this;
    wx.getStorage({
      key: 'vipInfo',
      success: function (res) {
        that.setData({
          vipid: res.data.id
        });
        // 加载常用入住人列表
        that.loadCyrzr();
      },
    });
  },

  /**
   * 跳转到添加入住人界面
   */
  navigateToTjrzr: function() {
    wx.navigateTo({
      url: '/pages/personal/cyrzr/tjrzr/tjrzr',
    })
  },

  /**
   * 加载常用入住人列表
   */
  loadCyrzr: function() {
    let params = {
      url: app.globalData.serverUrl + 'getCyrzrs',
      body: {
        vipid: this.data.vipid,
        yx: '1'
      }
    }
    let that = this;
    request.doRequest(
      params,
      function(data) {
        for (var i = 0; i < data.length; i++) {
          data[i]['selected'] = false;
        }
        that.setData({
          cyrzrList: data
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
   * 选择常用入住人
   */
  selectCyrzr: function() {
    var tempCyrzrList = this.data.cyrzrList;
    var cnt = 0;
    var cyrzrIndex = [];
    for (var i = 0; i < tempCyrzrList.length; i++) {
      if (tempCyrzrList[i].selected) {
        cyrzrIndex[cnt] = i;
        cnt++;
      }
    }

    if (cnt == 0) {
      wx.showToast({
        title: '请选择入住人',
        icon: 'none'
      })
      return;
    } else if (cnt > this.data.maxNum) {
      wx.showToast({
        title: '最多选择' + this.data.maxNum + '个入住人',
        icon: 'none'
      })
      return;
    }

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    if (this.data.maxNum == 2) {
      if (cnt == 1) {
        prevPage.setData({
          rzrxm1: this.data.cyrzrList[cyrzrIndex[0]].rzrxm,
          rzrsjhm1: this.data.cyrzrList[cyrzrIndex[0]].sjhm,
          rzrid1: this.data.cyrzrList[cyrzrIndex[0]].id,
          rzrlx: '2'
        })
      } else {
        prevPage.setData({
          rzrxm1: this.data.cyrzrList[cyrzrIndex[0]].rzrxm,
          rzrsjhm1: this.data.cyrzrList[cyrzrIndex[0]].sjhm,
          rzrid1: this.data.cyrzrList[cyrzrIndex[0]].id,
          rzrxm2: this.data.cyrzrList[cyrzrIndex[1]].rzrxm,
          rzrsjhm2: this.data.cyrzrList[cyrzrIndex[1]].sjhm,
          rzrid2: this.data.cyrzrList[cyrzrIndex[1]].id,
          rzrlx: '2'
        })
      }
    } else if (this.data.maxNum == 1) {
      // 实名认证加载实名认证信息
      prevPage.loadSmrzxx("2", this.data.cyrzrList[cyrzrIndex[0]].id)
    }
    
    
    
    wx.navigateBack({
      url: '/pages/home/fjyd/fjyd'
    })
  },

  /**
   * 选择
   */
  select: function(e) {
    var tempCyrzrList = this.data.cyrzrList;
    tempCyrzrList[e.currentTarget.dataset.index].selected = !tempCyrzrList[e.currentTarget.dataset.index].selected;
    this.setData({
      cyrzrList: tempCyrzrList
    })
  }
})