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

if (process.env.NODE_ENV === "production") {
    app.use(express.static("build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "build", "index.html"));
    });
}