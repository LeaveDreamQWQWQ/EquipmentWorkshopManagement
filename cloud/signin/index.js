// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const db=cloud.database().collection("user")
    const wxContext = cloud.getWXContext()
    try{
      var stuName=event.stuName
      var stuid=event.stuid
      var phoneNumber=event.phoneNumber
      //查询该用户是否有注册权限
      var aa=await db.where({
        stuid:stuid,
        stuName:stuName
      }).get({})
      //如果用户有注册权限
      if(aa.data.length!=0){
        var id=aa.data[0]._id
        var power=aa.data[0].power
        db.doc(id).update({
          data:{
            openid:wxContext.OPENID,
            phoneNumber:phoneNumber
          }   
        })
        var signed=true
      }
      else{
        var signed=false
      }
      return{
        signed,
        aa
      }
    } catch (e) {
        return{
          me:"error"
        }
    }
}