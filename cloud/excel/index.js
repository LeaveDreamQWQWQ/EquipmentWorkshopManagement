// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
var xlsx = require('node-xlsx');
const db = cloud.database()

exports.main = async(event, context) => {
  let {
    fileID
  } = event
  //1,通过fileID下载云存储里的excel文件
  const res = await cloud.downloadFile({
    fileID: fileID,
  })
  const buffer = res.fileContent

  const all_excel_data = [] //用来存储所有的excel数据
  //2,解析excel文件里的数据
  var sheets = xlsx.parse(buffer); //获取到所有sheets
  sheets.forEach(function(sheet) {
    console.log(sheet['name']);
    for (var rowId in sheet['data']) {
      //console.log(rowId);
      var row = sheet['data'][rowId]; //第几行数据
      if (rowId > 0 && row) { //第一行是表格标题，所以我们要从第2行开始读
        //3，把解析到的数据存到excelList数据表里
        all_excel_data.push({
          phoneNumber: row[0],
          stuName: row[1],
          stuid: row[2],
          per3d: row[3],
          per3d9: row[4],
          perangle: row[5],
          percnc: row[6],
          perlaser: row[7],
          permill: row[8],
          pertools: row[9]
          
        })
      }
    }
  });
  // 一起添加所有数据
  var result=await db.collection('user').add({data:all_excel_data}).then(res=>{
    return res
  }).catch(err=>{return err})
  return result
}

