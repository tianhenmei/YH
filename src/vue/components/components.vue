<style>
    @import '../../common/css/init.css';
    @import './style/components.css';
</style>
<template>
    <div kitty-components>
        <div class="yh-components-content">
            <h1 class="yh-title">{{title}}</h1>
            <components-content></components-content>
            <components-pages></components-pages>
            <components-edit></components-edit> <!--  v-on:addChild="componentAdd" -->
        </div>
    </div>
</template>
<script>
    import Pages from './components-pages'
    import Content from './components-content'
    import Edit from './components-edit'
    export default {
        data(){
            return {
                title:'KITTY EDITOR COMPONENTS'
            }
        },
        mounted(){
            this.init();
        },
        components:{
            'components-pages':Pages,
            'components-content':Content,
            'components-edit':Edit
        },
        methods:{
            init(){
                
            },
            componentAdd(){
                console.log('components componentAdd');
                // this.$emit('contentAddChild');
            }
        }
    }
</script>