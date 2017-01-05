import Vue from 'Vue'
import List from '../../../components/list.vue'
Vue.config.debug = true;//开启错误提示
window.onload = function () {
  new Vue({
      el: '#app',
      components: {
        'my-component': List
      },
      data:{
          title:"It's just a test!"
      }
  });
}