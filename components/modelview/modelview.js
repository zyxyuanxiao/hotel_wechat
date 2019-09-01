Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal弹窗
    show: {
      type: Boolean,
      value: false,
      observer: '_setShow'
    },
    //控制底部是一个按钮还是两个按钮，默认两个
    single: {
      type: Boolean,
      value: false
    },
    // 控制clickMask是否关闭
    clickMaskClose: {
      type: Boolean,
      value: true,
      observer: '_setClickMaskClose'
    },
    top: {
      type: Number,
      value: 0
    },
    bottom: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    clickMaskClose: true,
    show: false,
    top: 0,
    bottom: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _setClickMaskClose: function (newData, oldData) {
      this.setData({
        clickMaskClose: newData
      })
    },
    _setShow: function (newData, oldData) {
      this.setData({
        show: newData
      })
    },
    // 点击modal的回调函数
    clickMask: function () {
      // 点击modal背景关闭遮罩层，如果不需要注释掉即可
      if (this.data.clickMaskClose) {
        this.setData({ show: false })
      }
    },
    // 点击取消按钮的回调函数
    cancel: function () {
      this.setData({ show: false })
      this.triggerEvent('cancel')  //triggerEvent触发事件
    },
    // 点击确定按钮的回调函数
    confirm: function () {
      this.setData({ show: false })
      this.triggerEvent('confirm')
    }
  }
})