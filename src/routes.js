import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Watch from './views/Watch.vue'
import UserGroup from './views/UserGroup.vue'
import Index from './views/Index.vue'
import Config from './views/config/config.vue'
import Warn from './views/warn/warn.vue'
import Rule from './views/rule/rule.vue'
import Users from './views/UsersGroup/users.vue'
// import Os from './views/config/os.vue'
// import Blackbox from './views/config/blackbox.vue'
// import Sql from './views/config/sql.vue'
import Add1 from './views/add/Add1.vue'
import Add2 from './views/add/Add2.vue'
import Prometheus from './views/prometheus/prometheus.vue'
import Dashboard from './views/dashboard/dashboard.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
  {
    path: '/UserGroup',
    component: UserGroup,
    name: '',
    hidden: true
  },
    { path: '/Watch', component: Watch,hidden:true},
    {
      path: '/',
      component: Index,
      name: '首页',
      iconCls: 'el-icon-star-on',
      leaf: true,
      children: [
        { path: '/Index', component: Index, name: '主页' }
      ]
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
      path: '/',
      component: Watch,
      name: 'Dashboard',
      iconCls: 'el-icon-menu',
      leaf: true,
      children: [
        { path: '/dashboard', component: Dashboard, name: 'Dashboard' }
      ]
    },
    {
      path: '/',
      component: Watch,
      name: 'Prometheus',
      iconCls: 'el-icon-date',
      leaf: true,//只有一个节点
      children: [
        { path: '/prometheus', component: Prometheus, name: 'Prometheus' }
      ]
    },
    {
        path: '/',
        component: Watch,
        name: '配置',
        iconCls: 'el-icon-plus',//图标样式class
      leaf: true,//只有一个节点
        children: [
            // { path: '/main', component: Main, name: '主页', hidden: false },
            // { path: '/os', component: Os, name: 'OS' },
            { path: '/config', component: Config, name: '新增告警' },
            // { path: '/blackbox', component: Blackbox, name: 'Blackbox' },
            // { path: '/sql', component: Sql, name: 'SQL' }
        ]
    },
  {
    path: '/',
    component: Watch,
    name: '告警',
    iconCls: 'el-icon-search',//图标样式class
    leaf: true,//只有一个节点
    children: [
      { path: '/warn', component: Warn, name: '告警查询' },
    ]
  },
  {
    path: '/',
    component: Watch,
    name: '规则',
    iconCls: 'el-icon-document',//图标样式class
    leaf: true,//只有一个节点
    children: [
      { path: '/rule', component: Rule, name: '告警规则' },
    ]
  },
  {
    path: '/',
    component: UserGroup,
    name: '用户',
    iconCls: 'el-icon-document',//图标样式class
    leaf: true,//只有一个节点
    children: [
      { path: '/users', component: Users, name: '新建用户' },
    ]
  },
  
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;