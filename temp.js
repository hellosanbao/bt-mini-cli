let app = getApp()
Page({
    data:{},
    onLoad(){},
    onShow(){},
    onPullDownRefresh(){},  //下拉刷新 （请确保json配置中的enablePullDownRefresh开启）
    onReachBottom(){},   //触底事件 （请确保json配置中的onReachBottomDistance开启）
    onShareAppMessage(){  //分享事件，如果页面不需要分享请删除该方法
        return{
            title:{{shareTitle}},
            path:{{sharePath}},
            imageUrl:null
        }
    }
})