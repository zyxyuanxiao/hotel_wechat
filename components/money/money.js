// components/money/money.js
const util = require('../../utils/util.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 金额
    num: {
      type: String,
      value: '',
      observer: '_setNum'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    num: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _setNum: function(newData, oldData) {
      this.setData({
        num: util.parseDouble(newData)
      })
    }
  }
})
