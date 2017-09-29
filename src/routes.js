import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Watch from './views/Watch.vue'
import Index from './views/Index.vue'
import Config from './views/config/config.vue'
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
    { path: '/Watch', component: Watch,hidden:true},
    {
      path: '/',
      component: Index,
      name: '首页',
      iconCls: 'el-icon-menu',
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
        iconCls: 'el-icon-setting',//图标样式class
        children: [
            // { path: '/main', component: Main, name: '主页', hidden: false },
            // { path: '/os', component: Os, name: 'OS' },
            { path: '/config', component: Config, name: 'Jvm & Blackbox' },
            // { path: '/blackbox', component: Blackbox, name: 'Blackbox' },
            // { path: '/sql', component: Sql, name: 'SQL' }
        ]
    },
    {
        path: '/',
        component: Watch,
        name: '拓扑',
        iconCls: 'el-icon-more',
        children: [
            { path: '/add1', component: Add1, name: '拓扑位1' },
            { path: '/add2', component: Add2, name: '拓扑位2' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;