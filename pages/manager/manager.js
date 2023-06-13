Page({
    data:{
     
    },
    topeople(event){
      wx.navigateTo({
        url: '../people/people'
      })
    },
    totools(event){
      wx.navigateTo({
        url: '../tools/tools'
      })
    },
    toothers(event){
      wx.navigateTo({
        url: '../others/others'
      })
    }
  })