const app=getApp();
const db=wx.cloud.database().collection("user")

Page({
    data: {
        signed:false,
        power:false,
        openid:"",
        stuid:"",
        stuName:""
    },
    //加载时获取用户的openid
    


    onShow(){
        this.getopenid()
    },

    //获取用户openid
    getopenid:function(){
        this.setData({
            openid:app.globalData.openid,
            signed:app.globalData.signed,
            stuName:app.globalData.stuName,
            stuid:app.globalData.stuid,
            power:app.globalData.power,
        })
    },    
    //跳转到“注册”页面
    signin:function(){
        wx.navigateTo({
          url: '/pages/signin/signin'
        })
    },

    //跳转到“查看权限”页面
    seeper:function(){
        wx.navigateTo({
            url: '/pages/per/per'
          })
    },

    //退出登录
    async logout(){
        await db.where({stuid:this.stuid}).update({
            data:{openid:""}
        })
        app.setData().then(res=>{
            app.getopenid()
        }).then(res=>{
            this.onShow()
        })
        wx.showToast({
            title: '退出成功',
            icon:'success',
            duration:1000
        })
    },

    //跳转到“管理页面”
    manager:function(){
        wx.navigateTo({
            url: '/pages/manager/manager'
        })
    }
})