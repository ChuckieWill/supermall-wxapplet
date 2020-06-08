// pages/home/home.js
import {
  getMultiData,
  getGoodsData
} from '../../service/home.js'

const TOP_DISTANCE = 1000;
const type = ['pop', 'new', 'sell']

Page({
  data: {
    banners: [],
    recommends: [],
    titles: ['流行', '新款', '精选'],
    goods: {
      'pop': {
        page: 0,
        list: []
      },
      'new': {
        page: 0,
        list: []
      },
      'sell': {
        page: 0,
        list: []
      },
    },
    currentType: 'pop',
    showBackTop: false,
    isTabFixed: false,
    tabScrollTop: 0
  },


  onLoad: function(options) {
    // 1.请求轮播图以及推荐数据
    this._getMultiData()

    // 2.请求商品数据
    this._getGoodsData('pop'),
    this._getGoodsData('new'),
    this._getGoodsData('sell')

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 上拉加载更多-->获取新的数据
    this._getGoodsData(this.data.currentType)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 页面滚动监听
  onPageScroll(options){
    // 1.取出scrollTop   滚动的位置
    const scrollTop = options.scrollTop;

    // 2.修改showBackTop的值
    // 官方： 不要在滚动的函数回调中频繁的调用this.setData
    const flag = scrollTop >= TOP_DISTANCE;
    if(flag != this.data.showBackTop){
      this.setData({
        showBackTop: true
      })
    }

    // 3.修改isTabFixed的值
    const flag1 = scrollTop >= this.data.tabScrollTop
    if(flag1 != this.data.isTabFixed){
      this.setData({
        isTabFixed: flag1
      })
    }
  },



  // ----------------------------网络请求函数-------------------

  // 请求轮播图以及推荐数据
  _getMultiData() {
    getMultiData().then(res => {
      //console.log(res)
      //取出轮播图和推荐的数据
      const banners = res.data.data.banner.list;
      const recommends = res.data.data.recommend.list;

      //将banners和recommends放到data中
      this.setData({
        banners: banners,
        recommends: recommends
      })
    })
  },

  // 请求商品数据
  _getGoodsData(type) {
    // 1.获取页码
    const page = this.data.goods[type].page + 1;
    // 2.发送网络请求
    getGoodsData(type, page).then(res => {
      // 2.1 取出数据
      const list = res.data.data.list;
      // 2.2 将取出的数据放入对应类型的list中去
      const oldList = this.data.goods[type].list;
      oldList.push(...list)
      // 2.3 将数据设置到data中的goods中去
      const typeKey = `goods.${type}.list`;
      const pageKey = `goods.${type}.page`;
      this.setData({
        [typeKey]: oldList,
        [pageKey]: page
      })
    })
  },

  // ----------------------------事件监听函数-------------------

  // tab-control点击事件处理
  handleTabClick(e) {
    // console.log(e)
    // 取出index
    const index = e.detail.index;

    //设置curenType的值
    this.setData({
      currentType: type[index]
    })
  },

  // 图片加载完成的回调函数的监听处理
  handleImageLoad(){
    // 获取tab-control到顶部的距离
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect => {
      // console.log(rect)
      this.data.tabScrollTop = rect.top
    }).exec()
  }
})