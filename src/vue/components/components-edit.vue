<template>
    <div components-edit>
        <div class="yh-components-edit">
            <ul>
                <li components-text @click.prevent.stop="addComponents">
                    <span class="yh-edit-word">文字</span>
                    <span class="yh-edit-icon"></span>
                </li>
                <li components-image @click.prevent.stop="addComponents">
                    <span class="yh-edit-word">图片</span>
                    <span class="yh-edit-icon"></span>
                </li>
                <li components-button @click.prevent.stop="addComponents">
                    <span class="yh-edit-word">按钮</span>
                    <span class="yh-edit-icon"></span>
                </li>
                <li components-form @click.prevent.stop="addComponents">
                    <span class="yh-edit-word">表单</span>
                    <span class="yh-edit-icon"></span>
                </li>
                <li components-audio @click.prevent.stop="addComponents">
                    <span class="yh-edit-word">音乐</span>
                    <span class="yh-edit-icon"></span>
                </li>
                <li components-video @click.prevent.stop="addComponents">
                    <span class="yh-edit-word">视频</span>
                    <span class="yh-edit-icon"></span>
                </li>
                <li components-video @click.prevent.stop="savePage">
                    <span class="yh-edit-word">保存</span>
                    <span class="yh-edit-icon"></span>
                </li>
                <li components-video @click.prevent.stop="previewPage">
                    <span class="yh-edit-word">预览</span>
                    <span class="yh-edit-icon"></span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import MW from './bus.js'
    export default {
        methods:{
            addComponents(e){
                var name = e.currentTarget.attributes[0].name;
                MW.bus.$emit('addChild',name);
            },
            savePage(e){
                MW.bus.$emit('savePage');
            },
            previewPage(e){
                MW.bus.$emit('previewPage');
            }
        }
    }
</script>
<style>
    @import "./style/components-edit.css";
</style>