<template>
    <div :id="props.id" :style="props.position" 
        :class="props.classname" 
        @mouseenter.stop.prevent="showEditLayer"
        @mouseleave.stop.prevent="hideEditLayer"
        @click="addSetting"
        draggable="false"
        kitty-image 
        >
        <div class="kitty-image-content" rotate :style="props.rotate">
            <img class="yh-image" :src="props.src" :style="props.style"  yh-states />
            <a :class="{'yh-image-href':props.href}" :href="props.href"></a>
        </div>
        <yh-edit :props="style" :mold="'src'" :without="without"></yh-edit>
    </div>
</template>
<script>
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
                    width:181,
                    height:181,
                },
                position:{
                    left:0,
                    top:0
                },
                rotate:{
                    '-webkit-transform':'none',
                    transform:'none'
                },
                src:'http://localhost:9000/static/images/Helen.png',
                href:'',
                animation:''
            },{
                style:JSON.parse(JSON.stringify(Editor.style)),
            },{
                without:{
                    'font-size':true,
                    'line-height':true,
                    'color':true
                }
            })
        },
        props:['props'],
        methods:{
            getRem(value){
                return value / (750 / 16) + 'rem';
            },
            showEditLayer(e){
                let elem = $(e.target).closest('[id]')
                if(elem.hasClass('setting')){
                    $(e.target).children('.yh-edit-layer').show();
                }
            },
            hideEditLayer(e){
                if(!this.changeStatus){
                    let target = $(e.target).closest('[kitty-image]'),
                        image = target.find('.yh-image'),
                        page = target.closest('li[page]')

                    if(page.length > 0){

                    }else{
                        target.children('.yh-edit-layer').hide();
                    }
                }
            },
            addSetting(e){
                let target = $(e.target).closest('[kitty-image]')
                
                target.children('.yh-edit-layer').show();
                this.changeStatus = false
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
                rotate:{
                    '-webkit-transform':'none',
                    transform:'none'
                },
                src:options.src ? options.src : 'http://localhost:9000/static/images/image.png',
                href:options.href ? options.href : '',
                classname:options.classname ? options.classname : ''
            }
        }
    }
</script>
<style>
    [kitty-image] .kitty-image-content{
        position:relative;
    }
    [kitty-image] .kitty-image-content .yh-image-href{
        width:100%;
        height:100%;
        position:absolute;
        left:0;
        top:0;
    }
    [kitty-image] .kitty-image-content a {
        display:none;
    }
    [kitty-image] .kitty-image-content .yh-image-href {
        display:block;
    }
    [kitty-image] .kitty-image-content .yh-image {
        -webkit-user-select: none; 
        -moz-user-select: none;    
        -khtml-user-select: none;  
        -ms-user-select: none; 
        -o-user-select: none;
        user-select: none; 
    }
</style>