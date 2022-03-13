$(function () {
    $('#homepage').hide();
    $('#box');
    $('#box').hide().slideDown(500);


    $('button').click(function () {
        $('#intro').slideUp(400);
        $('#box').slideUp(200);
        $('#homepage').slideDown(300);
    });

});
