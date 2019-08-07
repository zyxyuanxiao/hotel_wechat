// pages/service/sqqj/sqqj.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gjddsjList: [
      '9:00-10:00', '10:00-11:00', '11:00-12:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
    ],
    qjrq: 'today',
    gjddsjIndex: 0,
    selectedIcon: '/resources/images/success-filling.png',
    unselectedIcon: '/resources/images/circle.png',
    selectFwnr1: false,
    selectFwnr2: false,
    selectFwnr3: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 选择清洁日期
   */
  selectQjrq: function(e) {
    console.log(e);
    this.setData({
      qjrq: e.currentTarget.dataset.qjrq
    });
  },

  /**
   * 选择管家到达时间
   */
  selectDdsj: function(e) {
    this.setData({
      gjddsjIndex: e.currentTarget.dataset.index
    });
  },

  /**
   * 选择附加服务
   */
  selectFjfw: function(e) {
    let fjfw = e.currentTarget.dataset.fjfw;
    if (fjfw == 1) {
      this.setData({
        selectFwnr1: !this.data.selectFwnr1
      });
    } else if (fjfw == 2) {
      this.setData({
        selectFwnr2: !this.data.selectFwnr2
      });
    } else if (fjfw == 3) {
      this.setData({
        selectFwnr3: !this.data.selectFwnr3
      });
    }
  }
})