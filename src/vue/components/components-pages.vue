<template>
    <div components-pages>
        <ul>
            <li class="clearfix" v-for="(page,index) in pages" :page="index" @mouseenter="pageenter" @mouseleave="pageleave">
                <div class="yh-page-edit">
                    {{index+1}}
                </div>
                <div class="yh-page-center">
                    
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
    import ScrollBar from './ScrollBar.js'
    import MW from './bus.js'
    export default {
        data(){
            return {
                currentPage:MW.currentPage,
                defaultPage:{
                    class:true,
                    status:false
                },
                scroll:null,
                pages:[{
                    class:true,
                    status:false
                },{
                    class:true,
                    status:true
                }]
            }
        },
        methods:{
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
            addPage(e){
                var index = Math.floor(e.target.parentNode.parentNode.attributes.page.value);
                this.pages.splice(index,0,Object.assign({},this.defaultPage));
                this.setScroll(1);
            },
            removePage(e){
                var index = Math.floor(e.target.parentNode.attributes.page.value);
                this.pages.splice(index,1);
                this.setScroll(-1);
            },
            setScroll(mode){
                this.scroll.init(mode);  // {scroll:this.scroll}
            }
        },
        mounted(){
            this.scroll = new ScrollBar({
                classname:'[components-pages]',
                height:504, //510,
                space: 0,
                number: 2.4,
                one: 210,
                fixedHeight: false
            });
            this.scroll.scroll = this.scroll;
            this.setScroll(0);
        }
    }
</script>
<style>
    @import "./style/components-pages.css";
</style>