const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    imgArr: [],
    indicatorDots: false, //小点
    autoplay: true, //是否自动轮播
    interval: 3000, //间隔时间
    duration: 300, //滑动时间
    current: 1,
    currentTab: 1,
    collectImage: '/resources/images/collect.png',
    collectedImage: '/resources/images/collected.png',
    locationImage: '/resources/images/home/location_h.png',
    mapImage: '/resources/images/home/map.png',
    yzrsIcon: '/resources/images/home/yzrs.png',
    bedIcon: '/resources/images/home/bed.png',
    sizeIcon: '/resources/images/home/size.png',
    doorIcon: '/resources/images/home/door.png',
    wjxIcon: '/resources/images/wjx.png',
    wjxFillingIcon: '/resources/images/wjx_filling.png',
    isCollected: false,
    tabList: [{
      index: 1,
      name: '酒店预定'
    }, {
      index: 2,
      name: '住客评价'
    }, {
      index: 3,
      name: '附近房源'
    }],
    fjssList: [
      {
        icon: '/resources/images/home/linyu.png',
        name: '24小时热水'
      }, {
        icon: '/resources/images/home/dianshi.png',
        name: '电视'
      }, {
        icon: '/resources/images/home/kongtiao.png',
        name: '空调'
      }, {
        icon: '/resources/images/home/wifi.png',
        name: '无线上网'
      }, {
        icon: '/resources/images/home/cfj.png',
        name: '电吹风'
      }, {
        icon: '/resources/images/home/xsyp.png',
        name: '洗漱用品'
      }
    ],
    pfList: [
      {
        name: '设施评分',
        score: '4.0'
      }, {
        name: '卫生评分',
        score: '5.0'
      }, {
        name: '安全感',
        score: '5.0'
      }
    ],
    yhpjList: [],
    fjfyList: [],
    fxList: [],
    showModal: false,
    hotel: {},
    starEnable: false,
    starSowDesc: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      hotelid: options.hotelid
    })
    if (options.ydsj) {
      this.setData({
        ydsj: JSON.parse(options.ydsj)
      });
    }
    //加载酒店信息
    this.loadHotelInfo();
  },

  /**
   * 切换滚动图片
   */
  swiperChange: function() {
    let temp = (this.data.current + 1) % this.data.imgArr.length;

    this.setData({
      current: temp == 0 ? this.data.imgArr.length : temp
    });
  },

  /**
   * 收藏酒店
   */
  collect: function() {
    this.setData({
      isCollected: !this.data.isCollected
    })
  },

  /**
   * 预览图片
   */
  previewImg: function(e) {
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 房间详情tab页切换
   */
  swichNav: function(e) {
    let index = e.detail.currentTab;
    this.setData({
      currentTab: index
    });
  },

  /**
   * 打开腾讯地图
   */
  openTencentMap: function() {
    let latitude = this.data.hotel.latitude;
    let longitude = this.data.hotel.longitude;
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },
  
  /**
   * 跳转到房间详情界面
   */
  navigateToFjxq: function() {
    if (this.data.ydsj) {
      wx.navigateTo({
        url: '/pages/home/fjxq/fjxq?ydsj' + JSON.stringify(this.data.ydsj) + '&hotelid=' + this.data.hotelid,
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/fjxq/fjxq?hotelid=' + this.data.hotelid,
      })
    }
  },

  /**
   * 查看房间信息
   */
  ckfjxx: function(e) {
    let params = {
      url: app.globalData.serverUrl + 'getHomeType',
      body: {
        id: e.currentTarget.dataset.typeid
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        data.fjjg = util.parseDouble(data.fjjg);
        data.hyjg = util.parseDouble(data.hyjg);
        that.setData({
          fjlx: data,
          showModal: true
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
   * 跳转到房间预定界面
   */
  navigateToFjyd: function(e) {
    if (this.data.ydsj) {
      wx.navigateTo({
        url: '/pages/home/fjyd/fjyd?ydsj=' + JSON.stringify(this.data.ydsj) + '&hotel=' + JSON.stringify(this.data.hotel) + '&fjlxid=' + e.currentTarget.dataset.typeid,
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/fjyd/fjyd?hotel=' + JSON.stringify(this.data.hotel) + '&fjlxid=' + e.currentTarget.dataset.typeid,
      })
    }
  },

  /**
   * 加载酒店信息
   */
  loadHotelInfo: function() {
    let params = {
      url: app.globalData.serverUrl + 'getHotel',
      body: {
        jdid: this.data.hotelid
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        that.setData({
          hotel: data.hotel,
          fxList: data.fxList,
          fjfyList: data.fjfyList,
          imgArr: data.imgArr
        });

        that.setYhpj(data.yhpjList);
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
   * 设置用户评价列表
   */
  setYhpj: function (yhpjList) {
    let zhpf = 0, sspf = 0, wspf = 0, aqg = 0;
    if (yhpjList.length == 0) {
      this.setData({
        zhpf: 5,
        sspf: 5,
        wspf: 5,
        aqg: 5,
        yhpjList: yhpjList
      })
    } else {
      for (var i = 0; i < yhpjList.length; i++) {
        yhpjList[i].pjsj = util.dateUtil.format(new Date(yhpjList[i].pjsj), 'Y-M-D H:F:S');
        zhpf += yhpjList[i].zhpf;
        sspf += yhpjList[i].sspf;
        wspf += yhpjList[i].wspf;
        aqg += yhpjList[i].aqg;
      }
      this.setData({
        zhpf: parseInt(zhpf / yhpjList.length),
        sspf: parseInt(sspf / yhpjList.length),
        wspf: parseInt(wspf / yhpjList.length),
        aqg: parseInt(aqg / yhpjList.length),
        yhpjList: yhpjList
      })
    }
    
  }
})