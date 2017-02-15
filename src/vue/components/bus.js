import Vue from 'Vue'
var bus = new Vue()
var currentPage = 0
var isMoving = false

module.exports = {
    bus:bus,
    currentPage:currentPage,
    isMoving:isMoving,
    textEditing:false,
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