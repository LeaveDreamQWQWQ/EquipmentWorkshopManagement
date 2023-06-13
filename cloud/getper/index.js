// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    try{
      var aa=await db.collection("user").where({
        stuName:event.stuName,
        stuid:event.stuid
      }).get({})
      if(aa.data.length!=0){
        var signed=true
        await db.collection("user").where({
          stuName:event.stuName,
          stuid:event.stuid
        }).update({
          openid:wxContext.OPENID
        })
      }
      // if(event.sid.length==0){
      //   var per3d=false;
      // }
      // else{
      //   var pert3d=await db.collection("3d18").where({sid:event.sid}).get({})
      //   if(pert3d.data.length!=0){
      //     var per3d=true;
      //   }
      //   else{
      //     var per3d=false;
      //   }
      // }
      

       return{
         signed
       }
    } catch (e) {console.error(e);}
}