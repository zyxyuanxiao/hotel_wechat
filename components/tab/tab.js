// components/tab/tab.js
Component({
  properties: {
    // 这里定义了 tabList 属性，属性值可以在组件使用时指定
    tabList: {
      type: Array,
      value: [],
      observer: '_setTabList'
    },

    // 当前页
    currentTab: {
      type: Number,
      value: 1,
      observer: '_setCurrentTab'
    }
  },
  data: {
    // 这里是一些组件内部数据
    tabList: {},
    currentTab: 1
  },

  methods: {
    /**
     *  设置tab标题列表
     */
    _setTabList: function (newDate, oldDate) {
      this.setData({
        tabList: newDate,
        width: 100 / newDate.length + '%'
      });
    },

    /**
     * 设置当前选中页
     */
    _setCurrentTab: function(newData, oldData) {
      this.setData({
        currentTab: newData
      });
    },

    /**
     * 切换tab页
     */
    swichNav: function (event) {
      console.log(11);
      let selectedTab = event.currentTarget.dataset.current;
      
      if (this.data.currentTab === selectedTab) {
        return false;
      } else {
        this.setData({
          currentTab: selectedTab
        });

        this.triggerEvent('swichNav', { currentTab: selectedTab });
      }
    }
  }
})