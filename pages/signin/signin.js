const app=getApp();
const db=wx.cloud.database().collection("user")
Page({
    data: {
        stuName:"",
        stuid:"",
        phoneNumber:"",
        signed:false,//是否注册成功
        power:false,//是否是管理员
        inputCode:"",
        code:"",
        time:0,
        timer:'',
        choice:true,//true:发送,false:time
        setInter:''

    },
    getStuName(e){
      this.setData({
          stuName:e.detail.value
      })  

    },
    getStuid(e){
        this.setData({
            stuid:e.detail.value
        })  
      },
    getPhoneNumber(e){
    this.setData({
        phoneNumber:e.detail.value
    })  
    },

    getCode(e){
        this.setData({
            inputCode:e.detail.value
        })  
    },
    send(){
        let that=this
        let code=''
        for(var i=0;i<4;i++){
            let rand=parseInt(Math.random()*(9,10)); 
            code=code+rand
        }
        that.setData({
            code:code,
        })
        wx.cloud.callFunction({
            name:"sendEmail",
            data:{
                target:that.data.stuid+"@mail.sustech.edu.cn",
                authcode:"欢迎使用SDIM设备工坊小程序平台，您的验证码为"+ code+",请尽快完成注册。" ,
                subject: "发送验证码"
            }
            }).then(res => {
                wx.showToast({
                  title: '请注意查看您的校园邮箱',
                  icon:'none',
                  duration:1000
                })
                that.count()
            }).catch(err => {
                console.log(err)
            })
    },
    count(){
        let that=this
        var sec=60
        that.setData({
            timer:sec+'秒后重发',
            choice:false,
        })
        that.setData({
            setInter:setInterval(()=>{
                that.setData({timer:sec+'秒后重发',})
                sec=sec-1
                if(sec==0){
                    that.end()
                }
            },1000)
        })
    },
    end(){
        clearInterval(this.data.setInter)
        this.setData({choice:true})
    },
    submit() {
        let that=this
        //使用函数,返回是否有注册权限
        wx.cloud.callFunction({
            name:"signin",
            data:{
                stuid:that.data.stuid,
                stuName:that.data.stuName,
                phoneNumber:that.data.phoneNumber
            }
        })
        .then(res=>{
            //有注册权限
            if(res.result.signed&&that.data.inputCode==that.data.code){
                let data=res.result.aa.data[0]
                app.globalData.stuName=data.stuName
                app.globalData.stuid=data.stuid
                app.globalData.phoneNumber=data.phoneNumber
                app.globalData.power=data.power
                app.globalData.power=data.power
                app.globalData.signed=true
                app.getopenid().then(res=>{
                    this.onShow()
                })
                setTimeout(()=>{
                    wx.showToast({
                        title: '注册成功',
                        icon:'success',
                        duration:1000
                    })
                },1000);
                wx.switchTab({
                    url: '/pages/user/user',
                })
                console.log("注册成功")
            }
            //无注册权限
            else{
                setTimeout(function (){
                    wx.showToast({
                        title: '没有注册权限',
                        icon:'error',
                        duration:2000
                })},500);
                console.log("注册失败",res)
                wx.switchTab({
                    url: '/pages/user/user',
                })
            }
        })
        .catch(error=>{
            console.log(error)
        })
    }

})