var QQMapWX = require('utils/qqmap-wx-jssdk.js');
var qqmapsdk;
//app.js
App({
  onLaunch: function() {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'TCCBZ-J67W4-FWTUL-DQEEN-FHM2K-3CBGZ'
    });

    // 获取定位
    this.getLocation(function() {

    });
  },

  /**
   * 全局变量
   */
  globalData: {
    serverUrl: 'https://www.eywang.com/miniprogram/',
    uploadUrl: 'https://www.eywang.com/common/miniUpload',
    imageUrl: 'https://www.eywang.com/file/miniprogram/',
    user: {
      address: {}
    }
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