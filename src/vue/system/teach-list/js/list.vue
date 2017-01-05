<template>
    <div kitty-list>
        <h1 class="title">{{title}}</h1>
        <div class="filter clearfix">
            <div class="add" @click="addTeacher" @mouseenter="mouseenterTeacher" @mouseleave="mouseleaveTeacher">Add</div>
        </div>
        <div class="teacher-list">
            <ul class="list-center">
                <li class="one clearfix" @mouseenter.stop.prevent="oneEnter" @mouseleave.stop.prevent="oneLeave" v-for="teacher in teachers">
                    <div class="left">
                        <img class="photo" :src="'http://localhost:9000'+teacher.photo" />
                        <p class="info">
                            <span class="name">{{teacher.name}}</span>&nbsp;
                            <span class="age">{{teacher.age}}岁</span>
                        </p>
                    </div>
                    <div class="right">
                        <div class="description">{{teacher.description}}</div>
                        <div class="good">擅长领域：{{teacher.expertise}}</div>
                        <div class="price clearfix">
                            <p class="number">{{teacher.price}}</p>
                            <p class="size">￥/0.5h</p>
                            <p class="reserve" :teacher_id="teacher.id">I like</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="add-layer layer"><!-- v-show="displayData.add_layer"-->
            <div class="title">
                <div class="center">
                    <p>ADD TEACHER</p>
                    <span class="icon close" v-on:click="closeLayer"></span>
                </div>
            </div>
            <div class="center clearfix">
                <div class="nickname one clearfix">
                    <span>姓名：</span><input type="text" v-model="teacher.name" />
                </div>
                <div class="password one clearfix">
                    <span>密码：</span><input type="password" v-model="teacher.password" />
                </div>
                <div class="photo one clearfix">
                    <span>头像：</span><input type="text" v-model="teacher.photo" />
                </div>
                <div class="age one clearfix">
                    <span>年龄：</span><input type="number" v-model="teacher.age" />
                </div>
                <div class="sex one clearfix">
                    <span>性别：</span><input type="text" v-model="teacher.sex" />
                </div>
                <div class="expertise one clearfix">
                    <span>擅长领域：</span><input type="text" v-model="teacher.expertise" />
                </div>
                <div class="description one clearfix">
                    <span>自我介绍：</span><textarea type="text" v-model="teacher.description"></textarea>
                </div>
                <div class="class one clearfix">
                    <span>上课账号：</span><input type="text" v-model="teacher.class" />
                </div>
                <div class="pay one clearfix">
                    <span>工资：</span><input type="text" v-model="teacher.pay" />
                </div>
                <div class="price one clearfix">
                    <span>每节课价格：</span><input type="text" v-model="teacher.price" />
                </div>
                <div class="account one clearfix">
                    <span>工资账号：</span><input type="text" v-model="teacher.account" />
                </div>
                <div class="contact one clearfix">
                    <span>联系方式：</span><input type="text" v-model="teacher.contact" />
                </div>
                <div class="country one clearfix">
                    <span>国籍：</span><input type="text" v-model="teacher.country" />
                </div>
                <div class="login-button" v-on:click="addTeacherEvent">Add</div>
            </div>
        </div>
        <kitty-tips :tips="tips"></kitty-tips>
    </div>
</template>
<script>
import Vue from 'Vue'
import KittyTips from '../../../components/tips.vue'
import $ from '../../../../common/js/lib/jquery.1.10.1.min.js'
    /**
 * Created by dagou on 16/10/31.
 */
export default {
    props:['teachers'],
    data(){
        return {
            tips:{
                show:false,
                transition_name:'showAndHide',
                message:''
            },
            title:"Welcome to Kitty English's Teacher!",
            displayData:{
                add_layer:false
            },
            teacher:{
                name:'',
                password:'',
                photo:'',
                age:22,
                sex:'Female',
                expertise:'',
                description:'',
                class:'',
                pay:10,
                price:23,
                account:'',
                contact:'',
                country:'菲律宾',
                createTime:'',
                lastTime:''
            }
        }
    },
    components:{
        KittyTips
    },
    methods:{
        oneEnter:function(event){
            var that = event.target;
            if(/(one-enter)/g.test(that.className)){

            }else{
                that.className += ' one-enter';
            }
        },
        oneLeave:function(event){
            var that = event.target;
            that.className = that.className.replace(' one-enter','');
        },
        closeLayer:function(event){
            // 方法内 `this` 指向 pageVue
            // `event` 是原生 DOM 事件
            var thatLayer = $(event.target).closest('.layer'),
                classname = thatLayer.attr('class').split(' ')[0];
            this.displayData[classname.replace('-','_')] = false;
        },
        addTeacher:function(event){
            //this.displayData.add_layer = true;
            var top = $('.add-layer').offset().top;

            $('html,body').animate({
                'scrollTop':top+'px'
            },500);
        },
        mouseenterTeacher:function(event){
            var elem = $(event.target);
            elem.removeClass('addLeave').addClass('addEnter');
            elem.html('Add Teacher');
        },
        mouseleaveTeacher:function(event){
            var elem = $(event.target);
            elem.removeClass('addEnter').addClass('addLeave');
            elem.html('Add');
        },
        addTeacherEvent:function(event){
            var elemData = this,
                data = JSON.parse(JSON.stringify(elemData.teacher));
            data.description = elemData.teacher.description.replace(/[\n\r]/g,'<br/>');
            $.ajax({
                type:'post',
                url:'/works/teacher/add',
                data:data,
                success:function(data){
                    var kittyTips = $('.kitty-tips');
                    elemData.tips.show = true;
                    if(data.state == 200){
                        elemData.teachers.push(JSON.parse(JSON.stringify(data.content)));
                        elemData.tips.message = data.message;
                    }else{
                        elemData.tips.message = '注册失败';
                    }
                    kittyTips.css({
                        'margin-left':(-(
                            kittyTips.width()+
                            parseFloat(kittyTips.css('padding-left'))+
                            parseFloat(kittyTips.css('padding-right'))
                        )/2)+'px'
                    });
                    setTimeout(function(){
                        elemData.tips.show = false;
                    },2000);
                },
                error:function(err){
                    console.log(err.message);
                }
            });
        }
    },
    watch:{
        teachers(val,old){
            console.log('Watching teacher');
        }
    }
};
</script>
<style>
    @import '../../../../common/css/init.css';
    @import '../css/teacher.css';
</style>