import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
    state:{
        currentPage:0,
        pages:[],
        // 临时与页面无关数据
        defaultPage:{
            background:{
                backgroundColor:'transparent',
                backgroundImage:'',
                backgroundRepeat:'no-repeat',
                backgroundPosition:'0 0',
                backgroundSize:'100% 100%'
            },
            elements:[]
        },
        data:{
            oparent:null,  // 临时父级
            ochild:null,  // 临时子级
            parent:null,
            pageIndex:-1,
            index:-1,
            tabIndex:-1,
            oindex:-1,
            parentData:null,
            elemData:null
        }
    },
    mutations:{
        init:(state,pagesData) => {
            state.pages = pagesData
        },
        create:(state) => {
            state.pages = [
                JSON.parse(JSON.stringify(state.defaultPage))
            ]
        },
        addPage:(state,index) => {
            if(index == state.pages.length - 1){
                state.pages.push(JSON.parse(JSON.stringify(state.defaultPage)))
            }else{
                state.pages.splice(index+1,0,JSON.parse(JSON.stringify(state.defaultPage)))
            }
        },
        removePage:(state,index) => {
            state.pages.splice(index,1);
        },
        setCurrentPage:(state,index) => {
            state.currentPage = index
        },
        setPageData:(state,payload) => {
            state.pages[state.currentPage][payload.parent][payload.stylename] = payload.value
        },
        reinitData:(state) => {
            state.data.parent = null
            state.data.pageIndex = -1
            state.data.index = -1
            state.data.tabIndex = -1
            state.data.elemData = null
        },
        getParent:(state,payload) => {
            let index = 0,
                parent = payload.elem.parentNode

            state.data[payload.name] = null
            while(parent){
                if(payload.type == 'attributes'){
                    if(parent.attributes[payload.value]){
                        state.data[payload.name] = parent
                        break
                    }
                }else{
                    if(new RegExp('('+payload.value+')','ig').test(parent.className)){
                        state.data[payload.name] = parent
                        break
                    }
                }
            }
        },
        getChild:(state,payload) => {
            let index = 0,
                children = payload.elem.children

            state.data[payload.name] = null
            for(let i = 0; i < children.length; i++){
                if(payload.type == 'attributes'){
                    if(children[i].attributes[payload.value]){
                        state.data[payload.name] = children[i]
                        break
                    }
                }else{
                    if(new RegExp('('+payload.value+')','ig').test(children[i].className)){
                        state.data[payload.name] = children[i]
                        break
                    }
                }
            }
        },
        getIndex:(state,payload) => {
            let index = 0,
                children = payload.elem.parentNode.children

            for(let i = 0; i < children.length; i++){
                if(children[i] == payload.elem){
                    index = i;
                    state.data[payload.name] = i
                    break;
                }
            }
        },
        getElemInfo:(state,elem) => {
            let parent = elem.parentNode,
                tab = [],
                children = [],
                oelem = null,
                i = 0,
                j = 0
            state.data.parent = null
            while(parent){
                if(/(page)/g.test(parent.className)){
                    break
                }
                if(parent.attributes['yh-tab']){
                    tab.push(parent)
                }
                parent = parent.parentNode
            }
            if(parent){
                state.data.parent = parent
                store.commit('getIndex',{
                    elem:parent,
                    name:'pageIndex'
                })
            }
            store.commit('getIndex',{
                elem:elem,
                name:'index'
            })
            if(tab.length > 0){
                for(i = tab.length - 1; i > -1; i--){
                    oelem = tab[i]
                    store.commit('getIndex',{
                        elem:oelem,
                        name:'tabIndex'
                    })
                    store.commit('getChild',{  // 获取当前elem的[yh-tab-content]
                        elem:oelem,
                        type:'attributes',
                        value:'yh-tab-content',
                        name:'ochild'
                    })
                    store.commit('getChild',{  // 获取当前elem的[yh-tab-content]
                        elem:state.data.ochild,
                        type:'classname',
                        value:'yh-tab-active',
                        name:'ochild'
                    })
                    store.commit('getIndex',{
                        elem:oelem,
                        name:'oindex'
                    })
                    if(i == tab.length - 1){
                        state.data.parentData = state.pages[state.data.pageIndex]
                                              .elements[state.data.tabIndex]
                                              .props.base.tabs[state.data.oindex].elements   // 当前的tab的所有elements
                    }else{
                        state.data.parentData = state.data.parentData[state.data.tabIndex]
                                              .props.base.tabs[state.data.oindex].elements  // tab 下的tab
                    }
                }
                state.data.elemData = state.data.parentData[state.data.index]
            }else{
                state.data.parentData = state.pages[state.data.pageIndex]
                                      .elements
                state.data.elemData = state.data.parentData[state.data.index]             
            }
        },
        getData:() => {
            let elem = document.getElementsByClassName('setting')[0],
                elemID = elem.id
            store.commit('getElemInfo',elem)
        },
        setValue:(state,payload) => {
            store.commit('getData')
            state.data.elemData.props.style[payload.stylename] = payload.actualValue
            store.commit('reinitData')
        },
        /**************
         * payload:数组，数组成员如下
         * parent: 当前style所在父级
         * stylename: 当前需修改的style名字
         * actualValue: 实际用来赋值的值
         * designValue: (非必须)设计的值
         ***************/
        setMultipleValue:(state,payload) => {
            store.commit('getData')
            let i = 0
            for(i = 0; i < payload.length; i++){
                if(payload[i].parent){
                    if(!state.data.elemData.props[payload[i].parent]){
                        state.data.elemData.props[payload[i].parent] = {}
                    }
                    state.data.elemData.props[payload[i].parent][payload[i].stylename] = payload[i].actualValue
                }else{
                    state.data.elemData.props[payload[i].stylename] = payload[i].actualValue
                }
            }
            store.commit('reinitData')
        },
        removeElement:(state,elemID) => {
            store.commit('getData')
            state.data.parentData.splice(state.data.index,1)
        }
    },
    actions:{
        
    },
    getters:{
        getPages:state => state.pages
    }
})



export default store