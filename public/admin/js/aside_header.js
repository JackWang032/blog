
$('.t_r').hover(function () {
        $('.listdown').slideDown();
    },
    function () {
        $('.listdown').css('display', 'none');
    });
$('.module_item').on('click', function (e) {
    let link = e.target.dataset.link;
    location.href = link;
})
$('#logout').click(function () {
    zdconfirm('系统确认框', '确认退出该用户？', function (r) {
        if (r) {
            location.href = "logout";
        }
    });

})
$('#management').click(function () {
    location.href = '/admin/user';
});