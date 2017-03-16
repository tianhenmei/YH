<template>
    <div components-pages>
        <ul class="components-pages-list">
            <li class="clearfix" v-for="(page,index) in pages" :page="index" @mouseenter="pageenter" @mouseleave="pageleave" @click.stop.prevent="changePage">
                <div class="yh-page-edit">
                    {{index+1}}
                </div>
                <div class="yh-page-center" id="'pageCanvas'+index">
                    <div class="yh-page-canvas" :style="page.background">
                        <div v-for="element in page.elements" :is="element.yh_module"
                            :props="element.props"
                            >
                        </div>
                    </div>
                </div>
                <div :class="{'yh-page-selected':page.class, 'yh-page-hide':page.status}">
                    <div class="yh-page-add" @click.stop.prevent="addPage">+</div>
                </div>
                <div :class="{'yh-page-remove':page.class, 'yh-page-hide':page.status}" @click.stop.prevent="removePage"></div>
            </li>
        </ul>
        <div class="yh-page-bottom"></div>
        <div components-pages-bar-bg>
            <div components-pages-bar></div>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'Vuex'
    import ScrollBar from './ScrollBar.js'
    import MW from './bus.js'
    import YHImage from './image.vue'
    import YHText from './text.vue'
    import YHButton from './button.vue'
    import YHTab from './tab.vue'

    const Elements = {
        'components-text':YHText,
        'components-image':YHImage,
        'components-button':YHButton,
        'components-tab':YHTab
        // 'components-form':YHForm,
        // 'components-audio':YHAudio,
        // 'components-video':YHVideo
    }
    export default {
        data(){
            return {
                currentPage:MW.currentPage,
                pages:[{
                    class:true,
                    status:false,
                    elements:[]
                }/*,{
                    class:true,
                    status:true
                }*/],
                defaultPage:{
                    class:true,
                    status:false
                },
                scroll:null
            }
        },
        // computed:mapState([
        //     'currentPage',
        //     'pages'
        // ]),
        // computed:mapGetters({
        //     // 'currentPage':'getCurrentPage',
        //     // 'pages':'getPages'
        // }),
        created(){
            var that = this;
            MW.bus.$on('setPages',(pages) => {
                that.setPages(pages)
            })
            // MW.bus.$on('drawSmallPage',() => {
            //     that.drawPage(undefined)
            // })
        },
        methods:{
            setPages(pages){
                this.pages = []
                for(let p = 0; p < pages.length; p++){
                    if(p == 0){
                        this.pages.push(Object.assign({},{
                            class:true,
                            status:false
                        },pages[p]));
                    }else{
                        this.pages.push(Object.assign({},{
                            class:true,
                            status:true
                        },pages[p]));
                    }
                }
                this.initScroll(this.pages.length - 1)
            },
            pageenter(e){
                var index = Math.floor(e.target.attributes.page.value);
                this.pages[index].status = false;
            },
            pageleave(e){
                var index = Math.floor(e.target.attributes.page.value);
                if(this.currentPage != index){
                    this.pages[index].status = true;
                }
            },
            changePage(e){
                let li = e.currentTarget
                let index = parseInt(li.attributes['page'].value)
                let selected = li.getElementsByClassName('yh-page-selected')[0]
                let remove = li.getElementsByClassName('yh-page-remove')[0]
                let oselected = document.getElementsByClassName('yh-page-selected')
                let oremove = document.getElementsByClassName('yh-page-remove')
                for( let o = 0; o < oselected.length; o++ ){
                    if(/(yh-page-hide)/g.test(oselected[o].className)){

                    }else{
                        oselected[o].className += ' yh-page-hide'
                    }
                }
                for( let o = 0; o < oremove.length; o++ ){
                    if(/(yh-page-hide)/g.test(oremove[o].className)){

                    }else{
                        oremove[o].className += ' yh-page-hide'
                    }
                }
                selected.className = (selected.className+'').replace('yh-page-hide','')
                remove.className = (remove.className+'').replace('yh-page-hide','')

                this.currentPage = index;
                MW.bus.$emit('changePage',index)
            },
            addPage(e){
                var index = Math.floor(e.target.parentNode.parentNode.attributes.page.value)
                var self = this
                MW.bus.$emit('addPage',index+1,function(page){
                    self.pages.splice(index+1,0,Object.assign({},self.defaultPage,page));
                    self.setScroll(1);
                });
            },
            removePage(e){
                var index = Math.floor(e.target.parentNode.attributes.page.value);
                this.pages.splice(index,1);
                MW.bus.$emit('removePage',index);
                this.setScroll(-1);
            },
            initScroll(mode){
                if(this.scroll){
                    this.setScroll(mode)
                }else{
                    this.scroll = new ScrollBar({
                        classname:'[components-pages]',
                        height:504, //510,
                        space: 0,
                        number: 2.4,
                        one: 251,
                        fixedHeight: false
                    });
                    this.scroll.scroll = this.scroll
                    this.setScroll(mode)
                }
            },
            setScroll(mode){
                this.scroll.init(mode);  // {scroll:this.scroll}
            }
        },
        mounted(){
            this.initScroll(0)
        }
    }
</script>
<style>
    @import "./style/components-pages.css";
</style>