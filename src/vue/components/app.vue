<template>
    <div id="app">
        <!--<gh-tab :tab></gh-tab>-->
        <h1>{{ title }}</h1>
    </div>
</template>
<script>
    import {mapState,mapMutations} form 'vuex'
    import ghTab from '../components/tab.vue'
    // import {Types} from './main.js'

    module.exports = {
        components:{
            ghTab
        },
        computed:mapState({
            tab:tab => state.tab
        }),
        props:{
            title:{
                require:true,
                default:'VUE COMPONENTS ING -> KITTY ENGLISH'
            },
            tab:{
                require:true,
                default:() => {
                    return {
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
                    }
                }   // default
            }
        }
    };
</script>