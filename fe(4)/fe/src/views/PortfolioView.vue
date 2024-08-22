<template>
<div class="homeBox">
    <headComponentWithQuote textColor="#fff"></headComponentWithQuote>
    <ul class="sortProducts">
        <li v-for="item in sortList" :key="item.id" @click="sortImgClick(item)"> {{ item.name }} / </li>
    </ul>

    <ul class="liBox">
      <li class="oneLi" @mouseleave="liLeave(item)" @mouseenter="liEnter(item)" v-for="item in imgList" :key="item.id">
        <img :src="item.imgUrl" class="imgClass" :class="{'hover':item.isHover}"/>
        <div v-show="item.isHover" class="mask">
          <div class="imgText headText">{{ item.headText }}</div>
          <div class="imgText1 footText">{{ item.footText }}</div>
        </div>
      </li>
    </ul>
    <myFootComponent></myFootComponent>
</div>
</template>

<script>
import headComponentWithQuote from "../components/headComponentWithQuote.vue"
import myFootComponent from "../components/myFootComponent.vue";

export default{
    name: 'PortfolioView',

    data(){
        return {
            sortList: [
                {name: 'All', id:1,},
                {name: 'BRANDING DESIGN | LOGO', id:2,},
                {name: 'CORPORATE', id:3,},
                {name: 'F&B', id:4,},
                {name: ' GRAPHIC', id:5,},
            ],
            imgList:[
                {isHover:false, headText: '单', footText: 'fdk发动机', imgUrl: 'https://th.bing.com/th/id/R.0cf18b64a10f12f92953b195da350856?rik=NgVcHHU63rJ7wg&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1206%2f20%2fc0%2f12068558_1340173115116.jpg&ehk=purWyLlTdK8jyrg0S15iIQmpfqBKh1crNn2%2bcIifmj0%3d&risl=&pid=ImgRaw&r=0', id:1},
                {isHover:false, headText: '单', footText: 'fdk发动机',imgUrl: 'https://th.bing.com/th/id/R.0cf18b64a10f12f92953b195da350856?rik=NgVcHHU63rJ7wg&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1206%2f20%2fc0%2f12068558_1340173115116.jpg&ehk=purWyLlTdK8jyrg0S15iIQmpfqBKh1crNn2%2bcIifmj0%3d&risl=&pid=ImgRaw&r=0', id:2},
                {isHover:false, headText: '单', footText: 'fdk发动机',imgUrl: 'https://th.bing.com/th/id/R.0cf18b64a10f12f92953b195da350856?rik=NgVcHHU63rJ7wg&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1206%2f20%2fc0%2f12068558_1340173115116.jpg&ehk=purWyLlTdK8jyrg0S15iIQmpfqBKh1crNn2%2bcIifmj0%3d&risl=&pid=ImgRaw&r=0', id:3},
                {isHover:false, headText: '单', footText: 'fdk发动机',imgUrl: 'https://th.bing.com/th/id/R.0cf18b64a10f12f92953b195da350856?rik=NgVcHHU63rJ7wg&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1206%2f20%2fc0%2f12068558_1340173115116.jpg&ehk=purWyLlTdK8jyrg0S15iIQmpfqBKh1crNn2%2bcIifmj0%3d&risl=&pid=ImgRaw&r=0', id:4},
                {isHover:false, headText: '单', footText: 'fdk发动机',imgUrl: 'https://th.bing.com/th/id/R.0cf18b64a10f12f92953b195da350856?rik=NgVcHHU63rJ7wg&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1206%2f20%2fc0%2f12068558_1340173115116.jpg&ehk=purWyLlTdK8jyrg0S15iIQmpfqBKh1crNn2%2bcIifmj0%3d&risl=&pid=ImgRaw&r=0', id:5},
                {isHover:false, headText: '单', footText: 'fdk发动机',imgUrl: 'https://th.bing.com/th/id/R.0cf18b64a10f12f92953b195da350856?rik=NgVcHHU63rJ7wg&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1206%2f20%2fc0%2f12068558_1340173115116.jpg&ehk=purWyLlTdK8jyrg0S15iIQmpfqBKh1crNn2%2bcIifmj0%3d&risl=&pid=ImgRaw&r=0', id:6},
            ]
        }

    },
    components:{headComponentWithQuote,myFootComponent},
    methods:{
        sortImgClick(item){
            
        },
        liEnter(item){
          item.isHover = true;
        },
        liLeave(item){
          item.isHover = false;
        }

    }
}
</script>

<style scoped>
.homeBox{
  position: absolute;
  width: 100%;
  height: 100%;
  background: #000;
  top: 0;
  left: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
.sortProducts{
    display: flex;
}
.liBox{
  display: flex;
  flex-wrap: wrap;
}
.oneLi{
  flex: 1 1 calc(50% - 12px); 
  margin-right: 12px;
  margin-bottom: 12px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}
.imgClass{
 width: 100%;
 height: 100%; 

}
@keyframes moveText{
  from{
    left:0px;
  }
  to{
    left:10px;
  }
}
.imgText{
  position: absolute;
  color: white;
  left:10px;
  width: 90%;
  word-break: break-all;
  text-align: left;
  animation:moveText 0.8s ease;
}
.imgText1{
  position: absolute;
  color: white;
  left:10px;
  width: 90%;
  word-break: break-all;
  text-align: left;
}
.mask{
  position:absolute;
  left:0px;
  top:0px;
  width:100%;
  height:100%;
  background:rgba(0,0,0,.4);
}
.headText{
  top: 10px;
}
.footText{
  bottom: 10px;
}
</style>