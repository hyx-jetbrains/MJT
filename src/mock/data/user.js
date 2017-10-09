//前后端分离工具MockJS
import Mock from 'mockjs';


//模拟登陆账户名、密码
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: '管理员'//管理员账户
  },
  {
    id: 2,
    username: '黄国强',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: '黄国强'//分用户账户
  }
];



//mock生成随机用户数据
const Users = [];

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.title(),
    cname:Mock.Random.cname(),
    addr: Mock.mock('@county(true)'),
    'age|18-60': 1,
    tag: Mock.Random.integer(0, 1),
    time:Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  }));
}

export { LoginUsers, Users };
