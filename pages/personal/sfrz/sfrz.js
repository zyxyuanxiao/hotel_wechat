// pages/personal/sfrz/sfrz.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cameraImage: '/resources/images/user/camera.png',
    hiddenGrxx: true,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '身份认证', //导航栏 中间的标题
      back: true
    },
    sfzzmPhoto: false,
    sfzfmPhoto: false,
    zpzPhoto: false,
    hideContinue: false,
    rzlx: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取vip信息
    var that = this;
    wx.getStorage({
      key: 'vipInfo',
      success: function (res) {
        that.setData({
          vipid: res.data.id
        });
      },
    });
  },

  /**
   * 本人认证
   */
  brrz: function() {
    this.setData({
      rzlx: '1'
    })
    this.loadSmrzxx("1");
  },

  /**
   * 常用入住人认证
   */
  cyrzrrz: function() {
    this.setData({
      rzlx: '2'
    })
    wx.navigateTo({
      url: '/pages/personal/cyrzr/cyrzr?showSelect=true&maxNum=1',
    })
  },

  takePhoto(e) { 
    if (this.data.rzjg == '2') {
      return;
    }
    this.setData({
      imageType: e.currentTarget.dataset.type
    })
    wx.navigateTo({
      url: '/pages/personal/sfrz/camera/camera?imageType=' + e.currentTarget.dataset.type,
    })
  },

  /**
   * 选择图片
   */
  selectImage: function(e) {
    if (this.data.rzjg == '2') {
      return;
    }
    let imageType = e.currentTarget.dataset.type;
    var that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // 上传图片
        that.uploadImage(imageType, res.tempFilePaths[0]);
      }
    })
  },

  /**
   * 上传图片
   */
  uploadImage: function(imagePath) {
    var that = this;
    wx.uploadFile({
      url: app.globalData.uploadUrl,
      filePath: imagePath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      success(res) {
        var response = JSON.parse(res.data);
        if (response.code == '0') {
          if (that.data.imageType == '1') {
            that.setData({
              sfzzmImage: response.data[0]
            })
            that.analysisIdCard(response.data[0], 'FRONT');
          } else if (that.data.imageType == '2') {
            that.setData({
              sfzfmImage: response.data[0]
            })
            that.analysisIdCard(response.data[0], 'BACK');
          } else if (that.data.imageType == '3') {
            that.setData({
              zpzImage: response.data[0]
            })
          }
        } else {
          wx.showToast({
            title: response.msg,
            icon: 'icon'
          })
        }
      }
    })
  },

  /**
   * 识别身份证信息
   */
  analysisIdCard: function(image, type) {
    let params = {
      url: app.globalData.serverUrl + 'idcardAnalysis',
      body: {
        imageUrl: image,
        imageType: type,
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        if (type == 'FRONT') {
          that.setData({
            xm: data.Response.Name,
            xb: data.Response.Sex,
            mz: data.Response.Nation,
            csrq: data.Response.Birth,
            zz: data.Response.Address,
            sfzhm: data.Response.IdNum
          })
        } else {
          var ValidDate = data.Response.ValidDate
          that.setData({
            zjyxqq: ValidDate.substring(0, 10),
            zjyxqz: ValidDate.substring(11, 21)
          })
        }
      },
      function (data) {}
    )
  },

  /**
   * 保存身份认证信息
   */
  saveSfrzxx: function() {
    if (this.data.xm == undefined) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return;
    }
    if (this.data.sfzhm == undefined) {
      wx.showToast({
        title: '请输入证件号码',
        icon: 'none'
      })
      return;
    } else {
      let flag = util.cardIDUtil.verification(this.data.sfzhm);
      if (flag != true) {
        wx.showToast({
          title: flag,
          icon: 'none'
        })
        return;
      }
    }

    let params = {
      url: app.globalData.serverUrl + 'saveSfrz',
      body: {
        sfz_1: this.data.sfzzmImage,
        sfz_2: this.data.sfzfmImage,
        zpz: this.data.zpzImage,
        rzjg: '1',
        xm: this.data.xm,
        sfzhm: this.data.sfzhm,
        vipid: this.data.rzlx == '1' ? this.data.vipid : '',
        cyrzrid: this.data.rzlx == '2' ? this.data.cyrzrid : '',
        xb: this.data.xb,
        mz: this.data.mz,
        csrq: this.data.csrq,
        zz: this.data.zz,
        zjyxqq: this.data.zjyxqq,
        zjyxqz: this.data.zjyxqz
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        wx.showModal({
          title: '温馨提示',
          content: '已提交认证，请等待认证结果',
          confirmText: "确定", //默认是“确定”
          showCancel: false,//是否显示取消按钮
          confirmColor: 'skyblue',//确定文字的颜色
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                url: '/pages/personal/personal'
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
  },

  // 加载实名认证信息
  loadSmrzxx: function(type, cyrzrid) {
    this.setData({
      hideContinue: true,
      cyrzrid: cyrzrid
    })
    var body = {
      sfyx: '1'
    }
    if (type == '1') {
      body['vipid'] = this.data.vipid;
    } else {
      body['cyrzrid'] = cyrzrid;
    }
    let params = {
      url: app.globalData.serverUrl + 'selectSmrz',
      body: body
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        if (data == '不存在实名认证信息') {
          return;
        }
        that.setData({
          xm: data.xm,
          sfzhm: data.sfzhm,
          sfzzmImage: data.sfz_1,
          sfzfmImage: data.sfz_2,
          zpzImage: data.zpz,
          id: data.id,
          rzjg: data.rzjg
        });
        if (data.rzjg == '1') {
          wx.showModal({
            title: '温馨提示',
            content: '实名认证审核中，请耐心等待',
            confirmText: "确定", //默认是“确定”
            showCancel: false,//是否显示取消按钮
            confirmColor: 'skyblue',//确定文字的颜色
          })
        } else if (data.rzjg == '2') {
          wx.showModal({
            title: '温馨提示',
            content: '实名认证已通过',
            confirmText: "确定", //默认是“确定”
            showCancel: false,//是否显示取消按钮
            confirmColor: 'skyblue',//确定文字的颜色
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '实名认证审核不通过，请重新认证',
            confirmText: "确定", //默认是“确定”
            showCancel: false,//是否显示取消按钮
            confirmColor: 'skyblue',//确定文字的颜色
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
   * 展示个人信息
   */
  showGrxx: function() {
    if (this.data.sfzfmImage == undefined || this.data.sfzfmImage == undefined 
      || this.data.zpzImage == undefined) {
      wx.showToast({
        title: '请选择照片',
        icon: 'none'
      })
      return;
    }
    this.setData({
      hiddenGrxx: false
    })
  },

  /**
   * 取消
   */
  cancel: function() {
    this.setData({
      hiddenGrxx: true
    })
  },

  /**
   * 输入姓名
   */
  inputXm: function(e) {
    this.setData({
      xm: e.detail.value
    })
  },

  /**
   * 输入身份证号码
   */
  inputZjhm: function (e) {
    this.setData({
      sfzhm: e.detail.value
    })
  },
})