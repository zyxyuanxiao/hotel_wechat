var QQMapWX = require('utils/qqmap-wx-jssdk.js');
var qqmapsdk;
//app.js
App({
  onLaunch: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'TCCBZ-J67W4-FWTUL-DQEEN-FHM2K-3CBGZ'
    });

    // 获取定位
    this.getLocation(function() {});

    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    //这个最初我是在组件中获取，但是出现了一个问题，当第一次进入小程序时导航栏会把
    //页面内容盖住一部分,当打开调试重新进入时就没有问题，这个问题弄得我是莫名其妙
    //虽然最后解决了，但是花费了不少时间
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight
      }
    })
  },

  /**
   * 全局变量
   */
  globalData: {
    serverUrl: 'https://localhost/miniprogram/',
    uploadUrl: 'https://www.eywang.com/common/miniUpload',
    imageUrl: 'https://www.eywang.com/file/miniprogram/',
    user: {
      address: {}
    },
    servicePhone: '400 0719 828'
  },


  //获取用户地理位置
  getLocation: function(callBack) {
    var that = this;

    wx.getLocation({
      success: function(res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(addressRes) {
            that.globalData.user.address.nation = addressRes.result.address_component.nation;
            that.globalData.user.address.province = addressRes.result.address_component.province;
            that.globalData.user.address.city = addressRes.result.address_component.city;
            that.globalData.user.address.district = addressRes.result.address_component.district;
            that.globalData.user.address.street = addressRes.result.address_component.street;
            that.globalData.user.address.street_number = addressRes.result.address_component.street_number;
            that.globalData.user.address.lat = addressRes.result.location.lat;
            that.globalData.user.address.lng = addressRes.result.location.lng;
            that.globalData.user.address.address = addressRes.result.address;
            callBack();
          }
        })
      },
      fail: function() {
        wx.getSetting({
          success: function(res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: function(tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function(data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.getLocation({
                            success: function(res) {
                              //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
                              qqmapsdk.reverseGeocoder({
                                location: {
                                  latitude: res.latitude,
                                  longitude: res.longitude
                                },
                                success: function(addressRes) {
                                  that.globalData.user.address.nation = addressRes.result.address_component.nation;
                                  that.globalData.user.address.province = addressRes.result.address_component.province;
                                  that.globalData.user.address.city = addressRes.result.address_component.city;
                                  that.globalData.user.address.district = addressRes.result.address_component.district;
                                  that.globalData.user.address.street = addressRes.result.address_component.street;
                                  that.globalData.user.address.street_number = addressRes.result.address_component.street_number;
                                  that.globalData.user.address.lat = addressRes.result.location.lat;
                                  that.globalData.user.address.lng = addressRes.result.location.lng;
                                  that.globalData.user.address.address = addressRes.result.address;
                                  callBack();
                                }
                              })
                            },
                          })
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'none',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },
          fail: function(res) {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function(callBack) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              wx.setStorage({
                key: 'userInfo',
                data: res.userInfo,
              })
              callBack();
            }
          })
        }
      }
    })
  }
})