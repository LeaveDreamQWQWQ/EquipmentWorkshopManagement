const cloud = require('wx-server-sdk')
var myDate = new Date()
cloud.init()
const xlsx = require('node-xlsx')    //导入Excel类库
const db = cloud.database()   //声明数据库对象
const _ = db.command
exports.main = async (event, context) => {   //主函数入口
    try {
        let StuInfo = await db.collection('past').get()   //将获取到的数据对象赋值给变量，接下来需要用该对象向Excel表中添加数据
        let dataCVS = `pastInfo-${myDate.getFullYear() + '-' + (myDate.getMonth()+1) + '-' + myDate.getDate()}.xlsx`
        //声明一个Excel表，表的名字用随机数产生
        let alldata = [];
        let row = ['学生姓名','使用设备','开始时间','结束时间','预设时间']; //表格的属性，也就是表头说明对象
        alldata.push(row);  //将此行数据添加到一个向表格中存数据的数组中
//接下来是通过循环将数据存到向表格中存数据的数组中
        for (let key = 0; key<StuInfo.data.length; key++) {
            let arr = [];
            arr.push(StuInfo.data[key].stuName);
            arr.push(StuInfo.data[key].name);
            arr.push(StuInfo.data[key].startTime);
            arr.push(StuInfo.data[key].finishTime);
            arr.push(StuInfo.data[key].duration);
            alldata.push(arr)
            }
            var buffer = await xlsx.build([{   
            name: "mySheetName",
            data: alldata
            }]); 
            //将表格存入到存储库中并返回文件ID
            return await cloud.uploadFile({
            cloudPath: dataCVS,
            fileContent: buffer, //excel二进制文件
            })
    } catch (error) {
        console.error(error)
    }
}
