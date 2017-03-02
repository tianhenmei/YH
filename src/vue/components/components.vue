<style>
    @import '../../common/css/init.css';
    @import '../../common/css/animation.css';
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
    // import $ from '../../common/js/lib/jquery.1.10.1.min.js'

    import MW from './bus.js'
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
            this.initEvent();
        },
        components:{
            'components-pages':Pages,
            'components-content':Content,
            'components-edit':Edit
        },
        methods:{
            init(){
                
            },
            initEvent(){
                this.initUndoEvent()
                this.initCompleteEvent()
            },
            initCompleteEvent(){
                $(document).on('click','#complate',function(e){
                    $('.setting').removeClass('setting')
                    $('.yh-selection').hide()
                });
            },
            initUndoEvent(){
                document.addEventListener('click',function(e){
                    if($(e.target).closest('[id]').length > 0){
                        return
                    }
                    let setting = document.getElementsByClassName('setting'),
                        selection = document.getElementsByClassName('yh-selection'),
                        parents = $(e.target).parents('[id]').not('[id="app"]'),
                        s = 0
                    
                    if(parents.length == 0 && !MW.isMoving){
                        for(; s < setting.length; s++){
                            setting[s].className = setting[s].className.replace('setting','')
                        }
                        for(s = 0; s < selection.length; s++){
                            selection[s].style.display = 'none'
                        }
                    }
                    MW.isMoving = false
                },false);
            },
            componentAdd(){
                console.log('components componentAdd');
                // this.$emit('contentAddChild');
            }
        }
    }
</script>