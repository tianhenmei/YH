<template>
    <div :id="props.id" :style="props.position" :class="props.classname" kitty-image  @mouseenter.stop.prevent="showEditLayer" @mouseleave.stop.prevent="hideEditLayer">
        <div class="kitty-image-content">
            <img class="yh-image" :src="props.src" :style="props.style" rotate />
            <a :class="{'yh-image-href':props.href}" :href="props.href"></a>
        </div>
        <div class="yh-edit-layer">
            <div>替换</div>
            <input type="file" content="src" accept="image/*" mold="image" />
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                style:{
                    width:181,
                    height:181,
                },
                position:{
                    left:0,
                    top:0
                },
                src:'http://localhost:9000/static/images/Helen.png',
                href:'',
                animation:''
            }
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
                $(e.target).children('.yh-edit-layer').hide();
            }
        },
        initCtor(options,that){
            options = options || {}
            return {
                id:options.id ? options.id : '',
                style:{
                    width:that.getRem((options.width ||  options.width == 0) ? options.width : 181),
                    height:that.getRem((options.height ||  options.height == 0) ? options.height : 181)
                },
                position:{
                    left:0,
                    top:0,
                    webkitTransform:'none',
                    transform:'none'
                },
                src:options.src ? options.src : 'http://localhost:9000/static/images/Helen.png',
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