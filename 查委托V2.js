import { segment } from "oicq";
import fetch from "node-fetch";

//项目路径
const _path = process.cwd();

//简单应用示例

//1.定义命令规则
export const rule = {
  task123321: {
    reg: "^#*查委托(.*)", //匹配消息正则，命令正则
    priority: 500, //优先级，越小优先度越高
    describe: "【#例子】开发简单示例演示", //【命令】功能说明
  },
};

//2.编写功能方法
//方法名字与rule中的examples保持一致
//测试命令 npm test 例子
export async function task123321(e) {
  //e.msg 用户的命令消息
  //console.log("用户命令：", e.msg);

  //执行的逻辑功能
  let url = "http://114.132.218.87:12583/api/genshin/task/" + e.msg.replace(/#|＃|查委托| /g, ""); //一言接口地址
  let response = await fetch(url); //调用接口获取数据
  let data = await response.json();//结果json字符串转对象
  let msg, name, code = response.status;
  if (code != 200 && code != 201) return;//请求不成功
  function requestOK() {
    if (data.hidden == true) {//判断是不是隐藏
      name = "隐藏成就" + ('《' + data.name + '》\n')
    } else {
      name = "成就" + ('《' + data.name + '》\n')
    }
    msg = data.desc + "\n"
    for (var key of data.involve) {
      if (key.type == '世界任务') break;
      msg += '每日委托' + ('《' + key.task + '》\n')
    }
    msg += "————\n" + data.msg + "\n————\n※ 文案: B站 oz水银"//大佬写的文案，建议保留，不然人家哪天就不更新了
    //console.log(`\u001b[32m[Get]\u001b[0m 已发送到\u001b[35m${e.user_id}\u001b[0m`)
  //最后回复消息
  //发送消息
    e.reply(name + msg);
  };
  if (code == 201) return e.reply(data.msg);
  if (code == 200) return requestOK();
  return true; //返回true 阻挡消息不再往下
}
