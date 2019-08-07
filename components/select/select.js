// components/select/select.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    date: {
      type: String,
      value: ''
    },

    areaList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    date: '',
    areaName: '区域',
    orderName: '推荐排序',
    roomType: '房型',
    conditions: '',
    areaCondition: '',
    orderCondition: '',
    roomTypeCondition: '',
    areaList: [],
    areaType: '1',
    area: '0',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击条件
     */
    tabNav: function(e) {
      var select = e.currentTarget.dataset.current;
      // 设置查询条件隐藏与显示
      if (this.data.currentTab === select) {
        this.setData({
          displays: this.data.displays == 'none' ? 'block' : 'none'
        })
      } else {
        this.setData({
          displays: 'block'
        })
      } 
      
      if (select == '-1') {
        this.setData({
          displays: "none"
        })
        this.triggerEvent('Date')
      } else {
        var showMode = select == 0;
        var swiperHeight = 600;
        
        if (select == '0') {
          swiperHeight = 600;
        } else if (select == '3') {
          swiperHeight = 800;
        } else {
          swiperHeight = 400;
        }
        this.setData({
          currentTab: select,
          isShow: showMode,
          swiperHeight: swiperHeight
        })
      }
    },

    /**
     * 选择区域类型
     */
    selectAreaType: function(e) {
      this.setData({
        areaType: e.currentTarget.dataset.type
      })
    },

    /**
     * 选择区域
     */
    selectArea: function(e) {
      this.setData({
        area: e.target.dataset.area,
        areaName: e.target.dataset.name,
        areaCondition: e.target.dataset.area == '0' ? "" : "area = '" + e.target.dataset.name + "'",
        displays: "none"
      });
      this.callBack();
    },

    /**
     * 回调函数
     */
    callBack: function() {
      let condition = '';
      if (this.data.areaCondition != '') {
        condition += 'where ' + this.data.areaCondition;
      }
      if (this.data.roomTypeCondition != '') {
        condition += condition == '' ? 'where ' + this.data.roomTypeCondition : ' and ' + this.data.roomTypeCondition;
      }
      if (this.data.orderCondition != '') {
        condition += this.data.orderCondition
      }
      const eventDetail = {
        conditions: condition
      }
      this.triggerEvent('Select', eventDetail)
    },

    /**
     * 选择筛选条件
     */
    selectCondition: function(e) {
      
      if (e.target.dataset.type == '1') {
        // 排序处理
        this.setData({
          orderName: e.target.dataset.name
        })
        if (e.target.dataset.value == '1') {   // 推荐排序
          this.setData({
            orderCondition: ''
          })
        } else if (e.target.dataset.value == '2') {  // 距离排序，暂未实现
          this.setData({
            orderCondition: ''
          })
        } else if (e.target.dataset.value == '3') {  // 价格高-低
          this.setData({
            orderCondition: ' order by fjjg desc'
          })
        } else if (e.target.dataset.value == '4') {  // 价格低-高
          this.setData({
            orderCondition: ' order by fjjg asc'
          })
        }
      } else if (e.target.dataset.type == '2') {
        // 房型处理
        this.setData({
          roomType: e.target.dataset.name,
          roomTypeCondition: e.target.dataset.value == '1' ? "" : "fjlx = '" + e.target.dataset.name + "'"
        })
      }
      this.setData({
        type: e.target.dataset.type,
        value: e.target.dataset.value,
        displays: "none"
      });
      this.callBack();
    },

    /**
     * 隐藏查询条件
     */
    hideNav: function() {
      this.setData({
        displays: "none"
      })
    },

  }
})