import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function extend(target,source){
    let i = 0
    if(Object.prototype.toString.call(source) === '[object Array]'){
        target = []
        for(i = 0; i < source.length; i++){
            target[i] = extend(target[i],source[i])
        }
    }else if(Object.prototype.toString.call(source) === '[object Object]'){
        target = {}
        for(i in source){
            target[i] = extend(target[i],source[i])
        }
    }else{
        target = source
    }
    return target
}

let store = new Vuex.Store({
    state:{
        currentPage:0,
        pages:[]
    },
    mutations:{
        init:(state,pagesData) => {
            // for(let i = 0; i < pagesData.length; i++){
            //     state.pages.push(i)
            //     state.pages[i] = pagesData[i]
            // }
            state.pages = pagesData
        }
    },
    getters:{
        getCurrentPage:state => state.currentPage,
        getPages:state => state.pages
    }
})



export default store