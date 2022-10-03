import { segment } from "oicq";
import fetch from "node-fetch";
import fs from "fs";
import download from "download";
import YAML from "yaml";
//项目路径
const _path = process.cwd();

//安装说明：需要安装依赖 npm i download

//简单应用示例

//1.定义命令规则
export const rule = {
    commission: {
    reg: "^#*委托查询(.*)", //匹配消息正则，命令正则
    priority: 500, //优先级，越小优先度越高
    describe: "【#例子】开发简单示例演示", //【命令】功能说明
  },
};


let file = './data/dailyTask/'
let url = `http://114.132.218.87:12583${file.slice(1)}`

if (!fs.existsSync(file)) {
  fs.mkdirSync(file)
}
let missionname = await download(encodeURI(url+'委托名字'))

fs.writeFileSync('./data/dailyTask/委托名字.yaml', missionname);
let missiondata = await download(encodeURI(url+'委托成就'))

fs.writeFileSync('./data/dailyTask/委托成就.yaml', missiondata);


//2.编写功能方法
//方法名字与rule中的examples保持一致
//测试命令 npm test 例子
export async function commission(e) {
    if ( !e.msg.replace(/#|＃|委托查询| /g, "")){
    e.reply("查看原神每日委托是否有隐藏成就，请输入要查询的每日委托名称，如#委托查询愿风带走思念");
    return true;
  }
    let msg = e.msg.replace(/#|＃|委托查询| /g, "")
    let reg = new RegExp('#|＃|？|。|,|，|·|!|！|—|《|》|…|「|」|『|』|、|查|询|委托|任务|成就', 'g')
    msg = msg.replace(/\.|\?/g, '').replace(reg, '')


  // 判断消息是否命中
    let namelist = fs.readFileSync('./data/dailyTask/委托名字.yaml', 'utf8')
    if (!namelist.includes(msg)) {
     e.reply("没有查询到相关任务，请确认任务名称是否正确！");
     return true;
    }
    namelist =  YAML.parse(namelist)
    let Name = new Map()

    if (!namelist) {e.reply("查询失败");return false}
    for(var i in namelist){
      namelist[i].forEach((v) => {
        Name.set(v, i)
      })
    }
    Name = Name.get(msg.trim())


  //判断委托是否含成就并返回数据
  
    let datalist = fs.readFileSync('./data/dailyTask/委托成就.yaml', 'utf8')
    datalist =  YAML.parse(datalist)
    datalist = datalist.find(v => v.name == Name)
    if (['蒙德委托', '璃月委托', '稻妻委托', '须弥委托'].includes(Name)) {
      let msg = `${Name}，无成就。`
      e.reply(msg)
      return true;
    }

    let replyname = `隐藏成就《${datalist.name}》\n${datalist.desc}\n\n${datalist.msg}`
    if (!datalist.hidden) replyname = replyname.slice(2)
    let by = '\n————————\n※ 文案: B站 oz水银'
    e.reply("任务名称：《"+msg+"》\n"+replyname + by)
    return true;
} 
