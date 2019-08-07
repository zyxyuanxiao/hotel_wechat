// components/star/star.js
Component({

  properties: {
    // 分数
    star: {
      type: Number,
      value: -1
    },
    // 是否可点击
    enable: {
      type: Boolean,
      value: true
    },
    // 是否显示描述
    showDesc: {
      type: Boolean,
      value: true
    },
    // 星星类型
    starClass: {
      type: String,
      value: 'star-item-icon-normal',
      observer: '_setStarClass'
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    star: -1, //评分的结束索引，实际从0开始，-1表示无评分
    stars: [{
      score: 1,
      desc: '非常差'
    }, {
      score: 2,
      desc: '差'
    }, {
      score: 3,
      desc: '一般'
    }, {
      score: 4,
      desc: '好'
    }, {
      score: 5,
      desc: '非常好'
    }],
    wjxIcon: '/resources/images/wjx.png',
    wjxFillingIcon: '/resources/images/wjx_filling.png',
    enable: true,
    showDesc: true,
    starClass: 'star-item-icon-normal',
  },

  methods: {
    /**
     * 设置星星css
     */
    _setStarClass: function(newData, oldData) {
      console.log(newData);
      this.setData({
        starClass: newData
      })
    },

    //评分事件
    Click: function(event) {
      if (!this.data.enable) {
        return;
      }
      this.setData({
        star: event.target.dataset.star + 1,
        desc: this.data.stars[event.target.dataset.star].desc
      })
      this.triggerEvent('Pf', {
        star: this.data.star
      })
    },
  }
})