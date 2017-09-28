<template>
  <div class='bgc'>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container animated zoomIn">
    <p class='logo'><img src="../../static/img/logo.png" alt=""></p>
    <h3 class="title">明镜台系统</h3>
    <el-form-item prop="account" class='name'>
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;background-color:#167BE0;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
    <p class='from'>&copy; 2017 平安银行-运维开发组</p>
  </div>
  
</template>

<script>
  import { requestLogin } from '../api/api';
  import NProgress from 'nprogress';
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: 'admin',
          checkPass: '123456'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            NProgress.start();
            var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            requestLogin(loginParams).then(data => {
              this.logining = false;
              NProgress.done();
              let { msg, code, user } = data;
              if (code !== 200) {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              } else {
                sessionStorage.setItem('user', JSON.stringify(user));
                this.$router.push({ path: '/Index' });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .bgc{
    background-color: #143E72;
    width:100%;
    height:100%;
    background-image: url('../../static/img/bg.png');
  }
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    width: 380px;
    padding: 25px 25px 25px 25px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    position: absolute;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
    .title {
      margin: 0px auto 32px auto;
      text-align: center;
      color: #505458;
      position: relative;
    }
    .remember {
      margin: 0px 0px 15px 0px;
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
  .logo{
    margin: 0 auto;
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .logo img{
    width: 70px;
  }
  .name{
   padding-top: 55px;
  }
  .title{
    position: relative;
    top: 80px;
    color: #73AAD7;
  }
</style>