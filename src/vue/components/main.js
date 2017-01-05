import Vue from 'vue'
import App from './app.vue'

var vm = new Vue({
    el:'#app',
    store,
    state:{
        title:'ING -> KITTY ENGLISH',
        tab:{
            items:[
                {
                    title:'Home first block',
                    content:'Home first block content'
                },{
                    title:'Home second block',
                    content:'Home second block content'
                },{
                    title:'Home third block',
                    content:'Home third block content'
                },{
                    title:'Home fourth block',
                    content:'Home fourth block content'
                }
            ]
        },
    },
    render: (h) => h(App)
});
