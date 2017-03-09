initTabEvent()
function initTabEvent(){
    $('[yh-tab-title]').on('touchstart','> .yh-tab-one',function(e){
        e.preventDefault()
        e.stopPropagation()

        let index = $(this).index(),
            content = $(this).closest('[yh-tab-title]').siblings('[yh-tab-content]').children()
        
        $(this).siblings().removeClass('yh-tab-active')
        $(this).addClass('yh-tab-active')
        content.removeClass('yh-tab-active')
        content.eq(index).addClass('yh-tab-active')
    })
}