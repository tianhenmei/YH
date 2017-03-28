<template>
    <div 
        :id="props.id" 
        :style="props.position" 
        :class="props.classname" yh-tab>

        <div class="clearfix" yh-tab-title>
             <div v-for="(tab,index) in props.base.tabs"
                class="yh-tab-one"
                :class="active == index ? 'yh-tab-active' : ''"
                :style="props.style"
                @touchstart.stop.prevent="changeTab"
                @mousedown.stop.prevent="changeTab">{{tab.title}}</div>
        </div>
        <div yh-tab-content>
            <div v-for="(tab,index) in props.base.tabs"
                :class="active == index ? 'yh-tab-active' : ''">
                <div v-for="(element,index) in tab.elements" :is="element.yh_module" :props="element.props">

                </div>
                <slot :name="'content'+index"></slot>
            </div>
        </div>

    </div>
</template>
<script>
    import YHImage from './yh-image.vue'
    import YHText from './yh-text.vue'
    import YHButton from './yh-button.vue'
    import YHAudio from './yh-audio.vue'
    const Elements = {
        'yh-text':YHText,
        'yh-image':YHImage,
        'yh-button':YHButton
    }
    export default {
        props:['props'],
        data(){
            return {
                style:{
                    width:200,
                    height:100,
                },
                position:{
                    width:750,
                    left:0,
                    top:0,
                },
                status:true,   // status == true  当前是编辑元素的tab
                active:0   // 当前激活的索引值，默认为0
            }
        },
        methods:{
            changeTab(e){
                let target = $(e.target).closest('.yh-tab-one'),
                    index = target.index()

                if(index != this.active){
                    this.active = index
                }
            }
        },
        initCtor(options,that){
            options = options || {}
            return {
                id:options.id ? options.id : '',
                style:{
                    width:that.getRem((options.childWidth ||  options.childWidth == 0) ? options.childWidth : 200),
                    height:that.getRem((options.childHeight ||  options.childHeight == 0) ? options.childHeight : 100),
                    'line-height':that.getRem((options.childHeight ||  options.childHeight == 0) ? options.childHeight : 100)
                },
                position:{
                    width:that.getRem((options.width ||  options.width == 0) ? options.width : 750),
                    left:0,
                    top:0,
                },
                base:{
                    tabs:[{
                        title:'tab1',
                        elements:[]
                    },{
                        title:'tab2',
                        elements:[]
                    },{
                        title:'tab3',
                        elements:[]
                    }]
                },
                classname:options.classname ? options.classname : ''
            }
        }
    }
</script>
<style>
[yh-tab] {
    width:300px;
    height:200px;
    position:absolute;
    left:0;
    top:0;
    background:#fff;
}
[yh-tab] [yh-tab-title]{
    width:100%;
}
[yh-tab] [yh-tab-title] > div {
    float:left;
    text-align:center;
    font-size:14px;
    color:#666;
    background:#efefef;
    cursor:pointer;
}
[yh-tab] [yh-tab-title] > div:hover,
[yh-tab] [yh-tab-title] > div.yh-tab-active{
    background:#ff0084;
    color:#fff;
}

[yh-tab] [yh-tab-content] > div{
    position: relative;
    display:none;
}
[yh-tab] [yh-tab-content] > div.yh-tab-active{
    display:block;
}
</style>