import Vue from 'Vue'
var bus = new Vue()
var currentPage = 0
var isMoving = false

module.exports = {
    bus:bus,
    currentPage:currentPage,
    isMoving:isMoving,
    moveStatus:false,
    textEditing:false,
    host:'http://localhost:9000/',
    pageData:{
        elements:[],
        background:{
            backgroundColor:'transparent',
            backgroundImage:'',
            backgroundRepeat:'no-repeat',
            backgroundPosition:'0 0',
            backgroundSize:'100% 100%'
        }
    }
};

/****MW.bus   自定义事件 */
// 事件名             触发地方（调用$emit）          监听地方（调用$on）
// setPages          components-content.vue












