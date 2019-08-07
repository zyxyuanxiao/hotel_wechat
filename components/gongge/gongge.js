Component({
  properties: {
    // 这里定义了 routers 属性，属性值可以在组件使用时指定
    routers: {
      type: Array,
      value: [],
      observer: '_setRouters'
    },
 
    /**
     * 宫格列数，即一行显示几列
     */
    columns: {
      type: Number,
      value: 3,
      observer: '_setColumns'
    }
  },
  data: {
    // 这里是一些组件内部数据
    routers: {},
    columns: 3
  },

  methods: {
    /**
     *  设置 routers
     */
    _setRouters: function (newDate, oldData) {
      this.setData({
        routers: newDate,
        width: 100 / this.data.columns + '%'
      });
    },

    /**
     * 设置宫格列数
     */
    _setColumns: function (newDate, oldData) {
      this.setData({
        columns: newDate,
        width: 100 / newDate + '%'
      });
    },

    /**
     * 点击宫格
     */
    clickItem: function (event) {
      let clickedIndex = event.currentTarget.dataset.index;
      this.triggerEvent('clickItem', { index: clickedIndex });
    }
  }
})