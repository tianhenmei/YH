import Vue from 'Vue'
import KittyList from './list.vue'
import $ from '../../../../common/js/lib/jquery.1.10.1.min.js'

Vue.config.debug = true;//开启错误提示

var pageVue = new Vue({
    el:'#app',
    data:{
        message:'臭皮蛋臭老公',
        teachers:[]
    },
    components:{
        'kitty-list':KittyList
    },
    methods:{
        initData(){
            var that = this;
            $.ajax({
                url:'http://localhost:9000/works/teacher/list',//'/works/teacher/list',
                type:'get',
                success:function(data){
                    console.log(data);
                    if(data.state == 200){
                        that.teachers = data.content;
                    }else{
                        alert(data.message);
                    }
                },
                error:function(err){
                    console.log(err);
                }
            });
        },
        initEvent(){

        },
        init(){
            this.initData();
            this.initEvent();
        },
    },
    created(){
        this.init();
    }
});

function init(){
    initData();
    initEvent();
}

function initData(){
    $.ajax({
        url:'http://localhost:9000/works/teacher/list',//'/works/teacher/list',
        type:'get',
        success:function(data){
            console.log(data);
            if(data.state == 200){
                // pageVue.$data.teachers = data.content;
                pageVue.$data.teachers = data.content;
            }else{
                alert(data.message);
            }
        },
        error:function(err){
            console.log(err);
        }
    });
}

function initEvent(){
    console.log('initEvent');
}