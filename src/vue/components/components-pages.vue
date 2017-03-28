<template>
    <div components-pages>
        <ul class="components-pages-list">
            <li class="clearfix" v-for="(page,index) in pages" :page="index" @mouseenter="pageenter" @mouseleave="pageleave" @click.stop.prevent="changePage">
                <div class="yh-page-edit">
                    {{index+1}}
                </div>
                <div class="yh-page-center" :id="'pageCanvas'+index">
                    <div class="yh-page-canvas" :style="page.background">
                        <div v-for="element in page.elements" :is="element.yh_module"
                            :props="element.props"
                            >
                        </div>
                    </div>
                </div>
                <div :class="'yh-page-selected'+(currentPage == index ? '' : (pageStatus[index].status ? '' :' yh-page-hide'))">
                    <div class="yh-page-add" @click.stop.prevent="addPage">+</div>
                </div>
                <div :class="'yh-page-remove'+(currentPage == index ? '' : (pageStatus[index].status ? '' :' yh-page-hide'))" @click.stop.prevent="removePage"></div>
            </li>
        </ul>
        <div class="yh-page-bottom"></div>
        <div components-pages-bar-bg>
            <div components-pages-bar></div>
        </div>
    </div>
</template>
<script>
    import {mapState,mapGetters} from 'vuex'
    import ScrollBar from './ScrollBar.js'
    import MW from './bus.js'
    import YHImage from './yh-image.vue'
    import YHText from './yh-text.vue'
    import YHButton from './yh-button.vue'
    import YHTab from './yh-tab.vue'
    import YHAudio from './yh-audio.vue'

    const Elements = {
        'components-text':YHText,
        'components-image':YHImage,
        'components-button':YHButton,
        'components-tab':YHTab,
        'components-audio':YHAudio,
        // 'components-form':YHForm,
        // 'components-video':YHVideo
    }
    export default {
        data(){
            return {
                pageStatus:[],
                scroll:null,
                title:'components-pages title'
            }
        },
        computed:{
            ...mapState([
                'currentPage',
                'pages'
            ])
        },
        watch:{
            pages(newv,oldv){
                console.log('page change')
                if(this.pages.length > 1){
                    if(this.pageStatus.length == 0){
                        // this.initScroll(this.pages.length - 1)
                        this.initScroll(this.pages.length)
                    }else{
                        this.initScroll(1)
                    }
                }else{
                    this.initScroll(1)
                }
                for(let i = this.pageStatus.length; i < this.pages.length; i++){
                    this.pageStatus.push({
                        status:false
                    })
                }
                this.pageStatus[this.currentPage].status = true
            },
            currentPage(newv,oldv){
                this.pageStatus[oldv].status = false
                this.pageStatus[newv].status = true
            }
        },
        created(){
            var that = this;
        },
        mounted(){
            this.initScroll(0)
        },
        methods:{
            setPages(pages){
                this.initScroll(this.pages.length - 1)
            },
            pageenter(e){
                var index = Math.floor(e.target.attributes.page.value);
                this.pageStatus[index].status = true;
            },
            pageleave(e){
                var index = Math.floor(e.target.attributes.page.value);
                if(this.currentPage != index){
                    this.pageStatus[index].status = false;
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

                this.$store.commit('setCurrentPage',index)
                $('.yh-selection').hide()
            },
            addPage(e){
                var index = Math.floor(e.target.parentNode.parentNode.attributes.page.value)
                
                this.$store.commit('addPage',index)
                // this.setScroll(1);
            },
            removePage(e){
                var index = Math.floor(e.target.parentNode.attributes.page.value);
                this.$store.commit('removePage',index)
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
        }
    }
</script>
<style>
    @import "./style/components-pages.css";
</style>