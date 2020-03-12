<template>
  <div class="container">
    <section>
      <div id="container_demo" >
        <a class="hiddenanchor" id="toregister"></a>
        <a class="hiddenanchor" id="tologin"></a>
        <div id="wrapper">
          <div id="login" class="animate form">
            <div>
              <h1>Log in</h1>
              <p>
                <label for="username" class="uname" data-icon="u" > Your username </label>
                <input v-model="loginParam.username" id="username" name="username" required="required" type="text" placeholder="myusername"/>
              </p>
              <p>
                <label for="password" class="youpasswd" data-icon="p"> Your password </label>
                <input v-model="loginParam.password" id="password" name="password" required="required" type="password" placeholder="eg. X8df!90EO" />
              </p>

              <p class="keeplogin">{{msg}}</p>

              <p class="login button">
                <button @click="login">Login</button>
              </p>
              <p class="change_link">
                Not a member yet ?
                <a href="#toregister" class="to_register">Join us</a>
              </p>
            </div>
          </div>
          <div id="register" class="animate form">
            <div>
              <h1> Sign up </h1>
              <p>
                <label for="usernamesignup" class="uname" data-icon="u">Your username</label>
                <input v-model="loginParam.username" id="usernamesignup" name="usernamesignup" required="required" type="text" placeholder="myusername" />
              </p>
              <p>
                <label for="passwordsignup" class="youpasswd" data-icon="p">Your password </label>
                <input v-model="loginParam.password" id="passwordsignup" name="passwordsignup" required="required" type="password" placeholder="eg. X8df!90EO"/>
              </p>
              <p class="keeplogin">{{msg}}</p>
              <p class="signin button">
                <button @click="register">Sign up</button>
              </p>
              <p class="change_link">
                Already a member ?
                <a  href="#tologin" class="to_register"> Go and log in </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

    export default {
        name: "Login",
        data () {
          return {
            clickShaker:false,
            msg:'',
            loginParam:{
              username:'',
              password:''
            }
          }
        },
        methods: {
          backSubmit (flag=false) {
            let THAT = this;
            setTimeout(()=>{
              THAT.msg = '';
              THAT.clickShaker = false;
              if(!!flag){
                let IOC_CACHE = JSON.parse(sessionStorage.getItem('IOC_CACHE'));
                IOC_CACHE.userInfo = flag;
                sessionStorage.setItem('IOC_CACHE',JSON.stringify(IOC_CACHE));
                THAT.$router.push({name:'Home'});
              }
            },2000)
          },
          beforeSubmit () {
            return (this.loginParam.username==='')||(this.loginParam.password==='')
          },
          login() {
            let THAT = this;
            if(THAT.clickShaker||THAT.beforeSubmit()){
              return
            }
            THAT.clickShaker = true;
            THAT.msg = 'log ing';
            THAT.$api.user.login(THAT.loginParam).then(res=>{
              THAT.msg = res.data.msg;
              THAT.backSubmit(res.data.userInfo);
            }).catch(err=>{
              THAT.backSubmit()
            });
          },
          register() {
            let THAT = this;
            if(THAT.clickShaker||THAT.beforeSubmit()){
              return
            }
            THAT.clickShaker = true;
            THAT.$api.user.register(THAT.loginParam).then(res=>{
              if(res.data.status=='11000'){
                THAT.msg = '已存在该用户！';
              }else {
                THAT.msg = res.data.msg;
              }
              THAT.backSubmit(res.data.userInfo);
            }).catch(err=>{
              THAT.backSubmit()
            });
          }
        }
    }
</script>

<style scoped>
 @import "./css/demo.css";
 @import "./css/style.css";
 @import "./css/animate-custom.css";
</style>
