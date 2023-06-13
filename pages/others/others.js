// pages/others/others.js\
const DB = wx.cloud.database().collection("user");//声明数据库为user
const db = wx.cloud.database().collection("past")
Page({
    data:{
        emile:""
    },
    changeEmail(event) {
        this.data.emile = event.detail.value
    },
    makeSure(){
        var str = this.data.emile
        if (str.indexOf("@mail.sustech.edu.cn")>=0||str.indexOf(".com")>=0) {
            DB.doc("PowerEmail"
        ).update({
            data:{
                PowerEmail: this.data.emile
            },
            success(res){
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 2000
                })
                console.log("修改成功", res)
              },
              fail(res) {
                wx.showToast({
                    title: '修改失败',
                    icon: 'error',
                    duration: 2000
                  })
                console.log("修改失败", res)
              }
        })
        }else{
            wx.showToast({
                title: '邮件无效',
                icon: 'error',
                duration: 2000
              })
        }
        
    },
    chooseExcel(){
        let that = this
        wx.chooseMessageFile({
          count: 1,
          type:'file',
          success(res){
              let path = res.tempFiles[0].path;
              console.log("选择Excel成功，path")
              that.uploadExcel(path)
          }
        })
    },
    uploadExcel(path){
        let that = this
        wx.cloud.uploadFile({
            cloudPath: new Date().getTime()+'.xls',
            filePath: path,
            success: res => {
                console.log("上传成功", res.fileID)
                that.jiexi(res.fileID)
            },
            fail: err => {
                console.log("上传失败", err)
            }
        })
    },
    jiexi(fileId){
        wx.cloud.callFunction({
            name: "excel",
            data:{
                fileID: fileId
            },
            success(res) {
                console.log("解析并上传成功",res)
            },
            fail(res) {
                console.log("解析失败", res)
            }
        })
    },
    StuExcel(){
        wx.cloud.callFunction({
            name:"StuExcel",
             complete:res=>{
               wx.cloud.getTempFileURL({      //获取文件下载地址（24小时内有效）
                 fileList:[res.result.fileID],
                 success:res=>{
                   this.setData({
                     tempFileURL:res.fileList[0].tempFileURL,
                     showUrl:true
                   })
                   wx.setClipboardData({   //复制刚获取到链接，成功后会自动弹窗提示已复制
                     data:this.data.tempFileURL,
                     success (res) {
                       wx.getClipboardData({
                         success (res) {
                           console.log(res.data) // data
                         }
                       })
                     }
                   })
                 }
               })
             }
           })       
    },
})