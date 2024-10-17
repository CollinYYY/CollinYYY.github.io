<template>
	<view>
	    <view class="sub-nav">
	        <navigator url="/pages/index/index" class="sn1">首页</navigator>
	        <navigator url="/pages/map/map" class="sn2">地图</navigator>    
	        <navigator url="/pages/ana_images/ana_images" class="sn3">上传</navigator>
	        <navigator url="/pages/wode/wode" class="sn4">我的</navigator>
	    </view>
	<view>
		<map>
			id="map"
			longitude="116.397470" 
			latitude="39.908823"
			scale="14"
			controls="{{controls}}"
			markers="{{markers}}"
			show-location
			style="width: 100%; height: 300px;"
    </map>
  </view>		
	</view>
</template>

<script>
	import "E:/WEB_Develop/bird/bird/src/static/css/normalize.css";
	import "E:/WEB_Develop/bird/bird/src/static/css/index.css";
//	var amapFile = require('/WEB_Develop/bird/bird/src/libs/amap-wx.130.js');
	export default {
		data() {
			return {
				controls: [],
				markers: [{
					id: 0,
					latitude: 23.099994,
					longitude: 113.324520,
					width:50,
					height:50
				}],
				polyline: [{
				    points: [{
							longitude: 113.3245211,
							latitude: 23.10229
						}, 
						{
							longitude: 113.324520,
							latitude: 23.21229
						}],
				        color:"#FF0000DD",
				        width: 2,
				        dottedLine: true
				}],
				controls: [{
				        id: 1,
				        iconPath: '/resources/location.png',
				        position: {
				          left: 0,
				          top: 300 - 50,
				          width: 50,
				          height: 50
				        },
				        clickable: true
				      }]
			}
		},
		onLoad() {
			this.initMap();
		},
		methods: {
			initMap(){
				const mapContext=uni.createMapContext('map',this);
				mapContext.moveToLocation();
			}
		}
	}
</script>

<style>
@font-face {
    font-family: 'icomoon';
    src:  url('../../static/fonts/icomoon.eot?e068fy');
    src:  url('../../static/fonts/icomoon.eot?e068fy#iefix') format('embedded-opentype'),
      url('../../static/fonts/icomoon.ttf?e068fy') format('truetype'),
      url('../../static/fonts/icomoon.woff?e068fy') format('woff'),
      url('../../static/fonts/icomoon.svg?e068fy#icomoon') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: block;
}

</style>