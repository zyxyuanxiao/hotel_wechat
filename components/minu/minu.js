Component({
  properties: {
    num: {
      type: Number,
      value: 1
    },
    maxNum: {
      type: Number,
      value: 9999
    }
  },

  data: {
    // input默认是1
    num: 1,
    // 使用data数据对象设置样式名
    minusStatus: 'disabled',
    maxNum: 9999,
    plusStatus: 'normal'
  },

  methods: {
    /* 点击减号 */
    Minus: function() {
      var num = this.data.num;
      // 如果大于1时，才可以减
      if (num > 1) {
        num--;
      }
      // 只有大于一件且小于最大数的时候，才能normal状态，否则disable状态
      var minusStatus = num <= 1 ? 'disabled' : 'normal';
      var plusStatus = num >= this.data.maxNum ? 'disabled' : 'normal';
      // 将数值与状态写回
      this.setData({
        num: num,
        minusStatus: minusStatus,
        plusStatus: plusStatus
      });
      this.triggerEvent('Minus', { num: this.data.num });
    },
    /* 点击加号 */
    Plus: function() {
      var num = this.data.num;
      // 小于最大数时才能自增1
      if (num < this.data.maxNum) {
        num++;
      }
      // 只有大于一件且小于最大数的时候，才能normal状态，否则disable状态
      var minusStatus = num <= 1 ? 'disabled' : 'normal';
      var plusStatus = num >= this.data.maxNum ? 'disabled' : 'normal';
      // 将数值与状态写回
      this.setData({
        num: num,
        minusStatus: minusStatus,
        plusStatus: plusStatus
      });
      this.triggerEvent('Plus', { num: this.data.num });
    },
    /* 输入框事件 */
    Manual: function(e) {
      var num = e.detail.value;
      // 将数值与状态写回
      this.setData({
        num: num
      });
      this.triggerEvent('Manual', { num: this.data.num });
    }
  }
})