$(document).ready(function () {
    var onScrolling = false;
    var rbHeight = $('.rightbox-main').innerHeight();

    function getElementToPageTop(el) {
        if (el.parentElement) {
            return getElementToPageTop(el.parentElement) + el.offsetTop
        }
        return el.offsetTop
    }
    var orginalTopR = $('.hotAtl')[0] && (getElementToPageTop($('.hotAtl').get(0)) - 140);
    var orginalTopL = getElementToPageTop($('.datetime').get(0)) - 140;
    $(document).scroll(function () {
        var scroH = $(document).scrollTop();
        var elementTopR = $('.hotAtl')[0] && (getElementToPageTop($('.hotAtl').get(0)) - 140);
        var elementTopL = getElementToPageTop($('.datetime').get(0)) - 140;
        if (scroH >= elementTopR && scroH >= orginalTopR)
            $('.hotAtl').css('position', 'fixed')
        else
            $('.hotAtl').css('position', 'unset');
        if (scroH >= elementTopL && scroH >= orginalTopL)
            $('.datetime').css('position', 'fixed')
        else
            $('.datetime').css('position', 'unset');



        if (scroH > 1000) {
            $('.back-line').css('height', '783px');
            $('.backArrow').css('height', '72px');
        } else {
            $('.back-line').css('height', '0px');
            $('.backArrow').css('height', '0px');
        }
    })
    $('.backArrow').click(function () {
        onScrolling = true;
        $('html,body').animate({
            scrollTop: 0
        }, 600);
        $('.backArrow').animate({
            height: 0
        }, 1200);
        $('.back-line').animate({
            height: 0
        }, 400, function () {
            onScrolling = false;
        });
    })
    $(window).resize(function () {
        var offsetLeft = $('.main').offset().left;
        var width = $('.main').innerWidth();
        $('.backTop').offset({
            left: offsetLeft + width
        })

    })
})