const DB = wx.cloud.database().collection("user");//声明数据库为user
Page({
  data: {
    openid:"",
    stuName:"暂无",
    stuid:"未知",
    power:false,
    per3d:false,
    permill:false,
    percnc:false,
    perlaser:false,
    pertools:false,
    per3d9:false,
    perangle:false
  },
  //获取用户输入的name
  addName(event) {
    this.data.stuName = event.detail.value
  },
  //获取用户输入的学号
  addStuid(event) {
    this.data.stuid = event.detail.value
  },
  addData() {    
    DB.where({
      stuName:this.data.stuName//根据姓名进行查找，找到的数据用以下方式调用
    }).get({
      success: (res) =>{//进行条件判断，可以则进行下一步操作
        if(res.data.length == 0){
          DB.add({
            data: {
              openid:this.data.openid,
              stuName: this.data.stuName,
              stuid:this.data.stuid,
              per3d: this.data.per3d,
              permill: this.data.permill,
              percnc: this.data.percnc,
              perlaser: this.data.perlaser,
              pertools: this.data.pertools,
              per3d9: this.data.per3d9,
              perangle: this.data.perangle,
              power: this.data.power,
            },//数据的添加，这里是初始化，如果是修改可以将"add"改为"update"
            success(res){
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 2000
              })
              console.log("添加成功", res)
            },
            fail(res) {
              console.log("添加失败", res)
            }
          })
        }else{
          console.log("已有此用户")
          wx.showToast({
            title: '已有此用户',
            icon: 'error',
            duration: 2000
          })                 
        }
      }
    })
  },
  uptStuId(event) {
    this.data.stuid = event.detail.value
  },
  getData(){
    DB.where({
      stuid:this.data.stuid
    }).get({
      success: (res) =>{
        if(res.data.length == 0){
          console.log('没有数据')
          wx.showToast({
            title: '该用户不存在',
            icon: 'error',
            duration: 2000
          })
        }else{
          console.log(res.data[0]) 
          this.setData({
            stuName:res.data[0].stuName,
            stuid:res.data[0].stuid,
            per3d:res.data[0].per3d,
            permill:res.data[0].permill,
            percnc:res.data[0].percnc,
            perlaser:res.data[0].perlaser,
            pertools:res.data[0].pertools,
            per3d9:res.data[0].per3d9,
            perangle:res.data[0].perangle,
            power:res.data[0].power
          })
          wx.showToast({
            title: '查询/更新成功',
            icon: 'success',
            duration: 2000
          })       
        }
      }
    })
  },
  updper3d(){
    //where只能查询ID，要用where搜索得到结果并赋值后再进行搜索,所以得加一个用户ID的全局变量
    DB.where({
      stuName:this.data.stuName
    }).get({
      success: (res) =>{
        if(res.data.length == 0){
          console.log('没有数据')
        }else{
          console.log(res.data[0]._id) 
          DB.doc(res.data[0]._id).update({
            //更新数据的过程记得调整云开发权限，否则无法使用
            data: {
              per3d : !this.data.per3d
            },
            success(res){
              console.log("更新成功", res)
            },
            fail(res) {
              console.log("更新失败", res)
            }
          })
          if(this.data.per3d){
            this.setData({
              per3d:false
            })
          }else{
            this.setData({
              per3d:true
            })
          }    
        }
      }
    })
  },
  updpermill(){
    //where只能查询ID，要用where搜索得到结果并赋值后再进行搜索,所以得加一个用户ID的全局变量
    DB.where({
      stuName:this.data.stuName
    }).get({
      success: (res) =>{
        if(res.data.length == 0){
          console.log('没有数据')
        }else{
          console.log(res.data[0]._id) 
          DB.doc(res.data[0]._id).update({
            //更新数据的过程记得调整云开发权限，否则无法使用
            data: {
              permill : !this.data.permill
            },
            success(res){
              console.log("更新成功", res)
            },
            fail(res) {
              console.log("更新失败", res)
            }
          })
          if(this.data.permill){
            this.setData({
              permill:false
            })
          }else{
            this.setData({
              permill:true
            })
          }    
        }
      }
    })
  },
  updpercnc(){
    //where只能查询ID，要用where搜索得到结果并赋值后再进行搜索,所以得加一个用户ID的全局变量
    DB.where({
      stuName:this.data.stuName
    }).get({
      success: (res) =>{
        if(res.data.length == 0){
          console.log('没有数据')
        }else{
          console.log(res.data[0]._id) 
          DB.doc(res.data[0]._id).update({
            //更新数据的过程记得调整云开发权限，否则无法使用
            data: {
              percnc : !this.data.percnc
            },
            success(res){
              console.log("更新成功", res)
            },
            fail(res) {
              console.log("更新失败", res)
            }
          })
          if(this.data.percnc){
            this.setData({
              percnc:false
            })
          }else{
            this.setData({
              percnc:true
            })
          }    
        }
      }
    })
  },
  updperlaser(){
    //where只能查询ID，要用where搜索得到结果并赋值后再进行搜索,所以得加一个用户ID的全局变量
    DB.where({
      stuName:this.data.stuName
    }).get({
      success: (res) =>{
        if(res.data.length == 0){
          console.log('没有数据')
        }else{
          console.log(res.data[0]._id) 
          DB.doc(res.data[0]._id).update({
            //更新数据的过程记得调整云开发权限，否则无法使用
            data: {
              perlaser : !this.data.perlaser
            },
            success(res){
              console.log("更新成功", res)
            },
            fail(res) {
              console.log("更新失败", res)
            }
          })
          if(this.data.perlaser){
            this.setData({
              perlaser:false
            })
          }else{
            this.setData({
              perlaser:true
            })
          }    
        }
      }
    })
  },
  updpertools(){
    //where只能查询ID，要用where搜索得到结果并赋值后再进行搜索,所以得加一个用户ID的全局变量
    DB.where({
      stuName:this.data.stuName
    }).get({
      success: (res) =>{
        if(res.data.length == 0){
          console.log('没有数据')
        }else{
          console.log(res.data[0]._id) 
          DB.doc(res.data[0]._id).update({
            //更新数据的过程记得调整云开发权限，否则无法使用
            data: {
              pertools : !this.data.pertools
            },
            success(res){
              console.log("更新成功", res)
            },
            fail(res) {
              console.log("更新失败", res)
            }
          })
          if(this.data.pertools){
            this.setData({
              pertools:false
            })
          }else{
            this.setData({
              pertools:true
            })
          }    
        }
      }
    })
  },
  updper3d9(){
    //where只能查询ID，要用where搜索得到结果并赋值后再进行搜索,所以得加一个用户ID的全局变量
    DB.where({
      stuName:this.data.stuName
    }).get({
      success: (res) =>{
        if(res.data.length == 0){
          console.log('没有数据')
        }else{
          console.log(res.data[0]._id) 
          DB.doc(res.data[0]._id).update({
            //更新数据的过程记得调整云开发权限，否则无法使用
            data: {
              per3d9 : !this.data.per3d9
            },
            success(res){
              console.log("更新成功", res)
            },
            fail(res) {
              console.log("更新失败", res)
            }
          })
          if(this.data.per3d9){
            this.setData({
              per3d9:false
            })
          }else{
            this.setData({
              per3d9:true
            })
          }    
        }
      }
    })
  },
  updperangle(){
    //where只能查询ID，要用where搜索得到结果并赋值后再进行搜索,所以得加一个用户ID的全局变量
    DB.where({
      stuName:this.data.stuName
    }).get({
      success: (res) =>{
        if(res.data.length == 0){
          console.log('没有数据')
        }else{
          console.log(res.data[0]._id) 
          DB.doc(res.data[0]._id).update({
            //更新数据的过程记得调整云开发权限，否则无法使用
            data: {
              perangle : !this.data.perangle
            },
            success(res){
              console.log("更新成功", res)
            },
            fail(res) {
              console.log("更新失败", res)
            }
          })
          if(this.data.perangle){
            this.setData({
              perangle:false
            })
          }else{
            this.setData({
              perangle:true
            })
          }    
        }
      }
    })
  },
  updpower(){
    DB.where({
      stuName:this.data.stuName
    }).get({
      success: (res) =>{
        if(res.data.length == 0){
          console.log('没有数据')
        }else{
          console.log(res.data[0]._id) 
          DB.doc(res.data[0]._id).update({
            //更新数据的过程记得调整云开发权限，否则无法使用
            data: {
              power : !this.data.power
            },
            success(res){
              console.log("更新成功", res)
            },
            fail(res) {
              console.log("更新失败", res)
            }
          })
          if(this.data.power){
            this.setData({
              power:false
            })
          }else{
            this.setData({
              power:true
            })
          }    
        }
      }
    })
  },
  delData(){
    // wx.showModal({
    //   title: '提示',
    //   content: '是否删除该用户数据？',
    //   success: function(res) {
    //     if (res.confirm) {

    //     }
    //   }
    // })
    DB.where({
      stuName:this.data.stuName
    }).get({
      success: (res) =>{
        if(res.data.length == 0){
          console.log('没有数据')
          wx.showToast({
            title: '删除失败',
            icon: 'error',
            duration: 2000
          }) 
        }else{
          DB.where({
            stuName:this.data.stuName
          }).remove()
          console.log('删除成功')
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })  
        }
      }
    })
  }
  //要删除的姓名
  /*delDataInput(event) {
    console.log("删除的学生姓名", event.detail.value)
    name0 = event.detail.value
  },*/
  //要更新的id&要更新的年龄
  /*updDataInput(event) {
    id = event.detail.value
  },
  updAge(event) {
    age0 = event.detail.value
  },
  //删除数据
  delData() {
    DB.doc(id).remove({
      success(res){
        console.log("删除成功", res)
      },
      fail(res) {
        console.log("删除失败", res)
      }
    })
  },
  //更新数据
  updData() {
    DB.doc(id).update({
      data: {
        age: age0
      },
      success(res){
        console.log("更新成功", res)
      },
      fail(res) {
        console.log("更新失败", res)
      }
    })
  }*/
})
