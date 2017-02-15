import Vue from 'Vue'
// import Vuex from 'vuex'
import KittyComponents from '../../../components/components.vue'
// import $ from '../../../../common/js/lib/jquery.1.10.1.min.js'

Vue.config.debug = true;//开启错误提示
// Vue.use(Vuex)
var pageVue = new Vue({
    el:'#app',
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
