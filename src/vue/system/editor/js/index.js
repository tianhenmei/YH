import Vue from 'Vue'
// import store from './store'
import KittyComponents from '../../../components/components.vue'
// import $ from '../../../../common/js/lib/jquery.1.10.1.min.js'

Vue.config.debug = true;//开启错误提示
var pageVue = new Vue({
    el:'#app',
    // store,
    data:{
        message:'臭皮蛋臭老公',
        teachers:[]
    },
    components:{
        'kitty-components':KittyComponents
    },
    methods:{
        initData(){
            
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
