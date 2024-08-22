<template>
  <div>
    <headComponentWithQuote textColor="#000"></headComponentWithQuote>
    
    <div class="about">
      <div class="introText">
                <p>VincDesign是一間位於香港的設計工作室，於台灣設有分工作室，我們專注於品牌設計、視覺形象、網頁及包裝設計，設計屢獲殊榮，<br>包括 DFA亞洲最具影響力設計獎、Topawards Asia、環球設計大獎 HKDA Global Design Awards、 Communication Arts、<br>International Design Award、Creativity International Awards and Muse Creative Awards。</p>
                <p>你也可以關注我們的 Facebook 和 Instagram , 了解更多關於我們的資訊。</p>
                <p>您可以给我们发送信息：             </p>
      </div>
      <el-form :model="dynamicValidateForm" :rules="rules" ref="dynamicValidateForm" label-width="190px" class="demo-dynamic">
      <el-form-item
        prop="name"
        label="Name"
        :rules="[
          { required: true, message: '请输入name', trigger: 'blur' },
        ]"
      >
        <br>
        <el-input v-model="dynamicValidateForm.name"></el-input>
      </el-form-item>
      <el-form-item
        prop="email"
        label="email"
        :rules="[
          { required: true, message: '请输入email', trigger: 'blur' },
          { type: 'email', message: '请输入正确的email', trigger: ['blur', 'change'] }
        ]"
      >
        <br>
        <el-input v-model="dynamicValidateForm.email"></el-input>
      </el-form-item>
      <el-form-item
        prop="phone"
        label="Tel"
      >
        <br>
        <el-input v-model="dynamicValidateForm.phone"></el-input>
      </el-form-item>
      <el-form-item
        prop="message"
        label="Comment or Message"
        :rules="[
          { required: true, message: '请输入有效信息', trigger: 'blur' },
        ]"
      >
        <br>    
        <el-input v-model="dynamicValidateForm.message"></el-input>
      </el-form-item>
      <div class="isolation"></div>
      <el-form-item>
        <el-button type="info" plain @click="submitForm('dynamicValidateForm')">提交</el-button>
     
      </el-form-item>
    </el-form>


    <div id="container"></div>
    <div class="isolation"></div>
    <div class="query">
      <div class="common">
        <h5>一般查詢</h5>
        <p>香港</p>
        <a href="#">info@vincdesign.com</a>
        <p>Tel / Whatsapp +852 6716 9968</p>
        <p>香港大角咀必發道67號201室</p>
        <br>
        <p>台灣 @vvebrand</p>
        <a href="#">info@vincdesign.com</a>
        <p>Tel /  +886 02 85228670</p>
        <p>Line / vvebrand</p>
        <p>新北市新莊區新北大道四段179號14樓</p>
      </div>
      <div class="priceandjoin">
        <h5>報價查詢</h5>
        <a href="#">info@vincdesign.com</a>
        <br>
        <a href="#">info@vincdesign.com</a>
        <br>
        <h5>加入我們</h5>
        <a href="#">info@vincdesign.com</a>
      </div>
      <div class="location">
        <h5>我們的位置</h5>
        <a href="#">高德地图</a>
      </div>
    </div>
    </div><!-- //about -->
   
    <myFootComponent></myFootComponent>
  </div>
</template>

<script>
import myFootComponent from "../components/myFootComponent.vue";
import headComponentWithQuote from "../components/headComponentWithQuote.vue"
export default{
  data(){
    const phoneValidatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入电话号码'));
        } else {
          if(!/^1\d{10}$/.test(value)){
            callback(new Error('手机号码格式不正确'))
          }
          callback();
        }
      };
    return {
      dynamicValidateForm:{
        name: '',
        email: '',
        phone: '',
        message: ''
      },
      rules:{
        phone: [
            {required:true, validator: phoneValidatePass, trigger: 'blur' }
          ],
      },
      infoWindow: null, // 用于存储 InfoWindow 实例
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.dynamicValidateForm);
          this.$http.post('/user', this.dynamicValidateForm)
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    lockMapBounds(map) {
      var bounds = map.getBounds();
      map.setLimitBounds(bounds);
    },
    
  },
  components:{headComponentWithQuote,myFootComponent},

  mounted(){
    AMapLoader.load({
        key: "270eaf47a6467b161f89264318a07d04", //申请好的Web端开发者 Key，调用 load 时必填
        version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
      })
        .then((AMap) => {
          const map = new AMap.Map("container", {
            viewMode: '2D', //默认使用 2D 模式
              zoom: 18, //地图级别
              center: [121.400292, 31.244376], //地图中心点
          });
          const marker = new AMap.Marker({
            position: [121.400292, 31.244376], //位置
          });
          map.add(marker); //添加到地图

          AMap.plugin("AMap.MouseTool", function () {
            var mouseTool = new AMap.MouseTool(map); //创建鼠标工具插件实例
            mouseTool.close();

          });

          // 调用锁定地图范围的函数
          this.lockMapBounds(map);

          // 创建并显示信息窗体
          const info = [];
          info.push("<div><div><img style=\"float:left;\" src=\" https://webapi.amap.com/images/autonavi.png \"/></div> ");
          info.push("<div style=\"padding:0px 0px 0px 4px;\"><b>高德软件</b>");
          info.push("电话 : 010-84107000   邮编 : 100102");
          info.push("地址 :北京市朝阳区望京阜荣街10号首开广场4层</div></div>");
          this.infoWindow = new AMap.InfoWindow({
            content: info.join("<br/>"),
            offset: new AMap.Pixel(10,10)   // 设置信息窗体的位置
          });
          this.infoWindow.open(map, map.getCenter());


        })
        .catch((e) => {
          console.error(e); //加载错误提示
        });
       
  }
}
</script>


<style scoped>
.about{
  padding: 20px 198px;
}
.introText{
    line-height: 40px;
    margin-right: 60px;
    text-align: left;
}
 #container {
  width: 100%;
  height: 500px;
}
.el-form-item {
  scale: 1.1;
  font-weight: bolder;
}
.isolation{
  height:30px;
}
.demo-dynamic {
    width: 996px; /* 缩小表单宽度 */

  }

.el-input {
  width: 100%; /* 输入框宽度占满表单宽度 */
}

.query{
  display:flex;
  color: grey;
  width:100%;
  text-align: left;
}
.query a{
  display: block;
  color:grey;
}
.query h5{
  color:black;
}
.priceandjoin{
  flex: 1;
}
.common{
  flex:1;
}
.location{
  flex:1;
}
</style>