<template>
    <div class="all">
    <div class="headBox">
      <div @click="goToHome" :style="{ color: textColor }" class="title"> V I N C D E S I G N </div>
      <ul class="tabListBox">
        <li
          v-for="item in tabList"
          :key="item.id"
          @click="routerTo(item)"
          class="oneLi"
        >
          <a :style="{ color: textColor }">{{ item.name }}</a>
        </li>
      </ul>
    </div>
    <div class="textInfo" :style="{ color: textColor }">
        <div>VVe make a meaningful difference</div>
        <b> to brands.</b>
    </div>
    <div class="isolation" :style="{ color: textColor }"></div>
    </div>

  </template>
  
  <script>
  export default {
    name: "headComponentWithQuote",
    props: {
      textColor: {
        type: String,
        default: "white",
      },
    },
    data() {
      return {
        tabList: [
          { name: "团队介绍", id: 1, routerPath: "/team" },
          { name: "作品集", id: 2, routerPath: "/portfolio" },
          { name: "关于我们", id: 3, routerPath: "/introduction" },
          { name: "联络我们", id: 4, routerPath: "/about" },
        ],
      };
    },
    methods: {
      routerTo(item) {
        this.$router.push(item.routerPath);
      },
      goToHome() {
        this.$router.push("/");
      },
    },
  };
  </script>
  
  
  <style scoped>
  .all{
    position: relative;
  }
  .headBox {
    display: flex;
    height: 60px;
    align-items: center;
    cursor: pointer;
    font-size: 20px;
  }
  .title{
    margin-left: 80px;
    margin-top: 50px;
  }
  .tabListBox {
    display: flex;
    align-items: center;
    margin-left: auto;
    height: 60px;
    margin-top: 65px;
  }
  .oneLi {
    margin-right: 80px;
  }
  a {
    text-decoration: none;
    font-size: 14px !important;
    font-family: "Microsoft JhengHei UI", "Microsoft JhengHei", sans-serif;
    cursor:pointer;
    font-weight:bold;
  }
  .textInfo{
    position:absolute;
    top: 195px;
    left: 200px;
    width:100%;
    height: 170px;
    display: flex;
    align-items: center;
    color: black;
    font-size: 28px;   
    flex-direction: column; 
}
.textInfo div{
    text-align: left;
    width:100%;

}
.textInfo b{
    text-align: left;
    width:100%;
}
.isolation{
    height: 200px;
}
  </style>
  