<template>
    <div :id="props.id" :style="props.position" 
        :class="props.classname" 
        @mouseenter.stop.prevent="showEditLayer"
        @mouseleave.stop.prevent="hideEditLayer"
        kitty-audio 
        >
        <div class="kitty-audio-content"  rotate :style="props.rotate">
            <img class="yh-image" :src="props.src" :style="props.style" yh-states />
            <a :class="{'yh-image-href':props.href}" :href="props.href"></a>
        </div>
        <!--<yh-edit :props="style"></yh-edit>
        <div class="yh-edit-layer">
            <div>替换</div>
            <input type="file" content="src" accept="image/*" mold="image" />
        </div>-->
    </div>
</template>
<script>
    import MW from './bus.js'
    import {Execute} from './text-dom.js'
    import Editor from './editor.js'
    // edit-components
    import YHEdit from '../edit-components/yh-edit.vue'
    export default {
        components:{
            'yh-edit':YHEdit
        },
        data(){
            return Object.assign({
                style:{
                    width:200,
                    height:200,
                },
                position:{
                    left:0,
                    top:0
                },
                src:'http://localhost:9000/static/images/kitty-logo-200.png',
                href:'',
                animation:''
            },{
                style:Editor.style,
            })
        },
        props:['props'],
        methods:{
            getRem(value){
                return value / (750 / 16) + 'rem';
            },
            showEditLayer(e){
                $(e.target).children('.yh-edit-layer').show();
            },
            hideEditLayer(e){
                // $(e.target).children('.yh-edit-layer').hide();
                if(!this.changeStatus){
                    let target = $(e.target).closest('[kitty-image]'),
                        image = target.find('.yh-image'),
                        page = target.closest('li[page]')

                    if(page.length > 0){

                    }else{
                        target.children('.yh-edit-layer').hide();
                        // 更新pages
                        MW.bus.$emit(
                            'updateContent',
                            image.html(),
                            Execute.getStyleJSON(image[0].style.cssText),
                            this.$el.id
                        )
                    }
                }
            },
            addSetting(e){
                let target = $(e.target).closest('[kitty-image]')
                
                target.children('.yh-edit-layer').show();
                this.changeStatus = false
                

                if($(e.target).closest('.yh-edit-layer').length > 0){

                }else{
                    Editor.setEditData(this)
                }
            },
        },
        initCtor(options,that){
            options = options || {}
            return {
                id:options.id ? options.id : '',
                style:Object.assign({},JSON.parse(JSON.stringify(Editor.style)),options.style ? options.style : {
                    width:that.getRem(200),
                    height:that.getRem(200)
                }),
                position:{
                    left:0,
                    top:0
                },
                src:options.src ? options.src : 'http://localhost:9000/static/images/kitty-logo-200.png',
                href:options.href ? options.href : '',
                classname:options.classname ? options.classname : ''
            }
        }
    }
</script>
<style>
    [kitty-audio] .kitty-audio-content{
        position:relative;
    }
    [kitty-audio] .kitty-audio-content .yh-image-href{
        width:100%;
        height:100%;
        position:absolute;
        left:0;
        top:0;
    }
    [kitty-audio] .kitty-audio-content a {
        display:none;
    }
    [kitty-audio] .kitty-audio-content .yh-image-href {
        display:block;
    }
    [kitty-audio] .kitty-audio-content .yh-image {
        -webkit-user-select: none; 
        -moz-user-select: none;    
        -khtml-user-select: none;  
        -ms-user-select: none; 
        -o-user-select: none;
        user-select: none; 
    }
</style>