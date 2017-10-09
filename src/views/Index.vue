<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				<img src="../../static/img/logo.png" alt="" class='animated rotateIn'>
				<span class='tit animated flipInX'>{{collapsed?'':sysName}}</span>
			</el-col>
			<el-col :span="10" class="logo jiankong" :class="collapsed?'logo-collapse-width':'logo-width'">
				<router-link class='link' to="Dashboard"><span class='tit animated flipInX'>Dashboard</span></router-link>
				<router-link class='link' to="Prometheus"><span class='tit animated flipInX'>Prometheus</span></router-link>
				<router-link class='link' to="Watch"><span class='tit animated flipInX'>告警管理</span></router-link>
				<router-link class='link' to="warn"><span class='tit animated flipInX'>告警查询</span></router-link>
				<router-link class='link' to="UserGroup"><span class='tit animated flipInX'>用户组管理</span></router-link>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>新建用户</el-dropdown-item>
						<el-dropdown-item>新建组</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<div class='search'>
			<el-input placeholder="请输入内容"  v-model="input5">
				<!--<el-select class='config' v-model="select" slot="prepend" placeholder="请选择">-->
					<!--<el-option label="配置1" value="1"></el-option>-->
					<!--<el-option label="配置2" value="2"></el-option>-->
					<!--<el-option label="配置3" value="3"></el-option>-->
				<!--</el-select>-->
				<el-button slot="append" icon="search"></el-button>
			</el-input>
		</div>
		
		<p class='from'>&copy; 2017 平安银行-运维开发组</p>
</el-row>
</template>

<script>
  export default {
    data() {
      return {
        sysName:'明 镜 台 系 统',
        collapsed:false,
        sysUserName: '',
        sysUserAvatar: '',
				input5:'',
        select: '',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      rotate(){
        alert(1)
      },
      onSubmit() {
        console.log('submit!');
      },
      handleopen() {
        //console.log('handleopen');
      },
      handleclose() {
        //console.log('handleclose');
      },
      handleselect: function (a, b) {
      },
      //退出登录
      logout: function () {
        var _this = this;
        this.$confirm('确认退出吗?', '提示', {
          //type: 'warning'
        }).then(() => {
          sessionStorage.removeItem('user');
          _this.$router.push('/login');
        }).catch(() => {
        
        });
        
        
      },
      //折叠导航栏
      change(){
        alert(1)
      },
      collapse:function(){
        this.collapsed=!this.collapsed;
        //修改BUG:宽度无法正常切换问题
        if(this.collapsed!=true){
          document.getElementsByClassName('el-menu')[0].style.width = '230px';
        }
      },
      showMenu(i,status){
        this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
      }
    },
    mounted() {
      var user = sessionStorage.getItem('user');
      if (user) {
        user = JSON.parse(user);
        this.sysUserName = user.name || '';
        this.sysUserAvatar = user.avatar || '';
      }
      
    }
  }

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	.tit{
		display: block;
		font-weight: 500;
		font-size: 20px;
		text-align: left;
		text-indent: -8px;
	}
	.config{
		width: 100px;
		text-align: center;
		padding-right:0;
	}
	.search{
		width: 600px;
		height: 80px;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 40%;
	}
	
	.link{
		color: #ffffff;
	}
	.jiankong{
		margin-left: 30px;
		height: 50px;
		width: 250px;
		line-height: 50px;
		span{
			font-size: 14px;
			display: inline-block;
			padding: 0 10px;
		}
		span:hover{
			color: #5e7382;
		}
	}
	.from{
		margin:0 auto;
		display: block;
		color: #fff;
		font-size: 14px;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 10px;
		font-weight:500;
	}
	.tit:hover{
		cursor: pointer;
	}
	.logo img{
		display: inline-block;
		height: 40px;
		position: relative;
		top: -5px;
		left: -18px;
		
	}
	.logo.jiankong.el-col.el-col-10.logo-width{
		width: 500px;
		margin-left:-20px;
	}
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		background: url('../../static/img/main-bg.png'), linear-gradient(#243F70,#5E9596); /* 标准的语法 */
		.header {
			height: 50px;
			line-height: 50px;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 30px;
						height: 30px;
						border-radius: 20px;
						margin-top: 10px;
						margin-left: 5px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				text-align: center;
				height:50px;
				font-size: 22px;
				padding-left:10px;
				/*padding-right:20px;*/
				border-color: rgba(238,241,146,0.3);
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 50px;
				line-height: 50px;
				cursor: pointer;
			}
		}
	}
</style>