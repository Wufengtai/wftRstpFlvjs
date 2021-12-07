var express =  require("express");
var expressWebSocket = require("express-ws");
var ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath("/home/wf/下载/ffmpeg/ffmpeg");
var webSocketStream = require("websocket-stream/stream");
var WebSocket = require("websocket-stream");
var http = require("http");
function localServer() {
    let app = express();
    app.use(express.static(__dirname));
    expressWebSocket(app, null, {
        perMessageDeflate: true
    });
    app.ws("/rtsp/:id/", rtspRequestHandle)
    app.listen(8888);
    console.log("express listened")
}
function rtspRequestHandle(ws, req) {
    console.log("rtsp request handle");
    const stream = webSocketStream(ws, {
        binary: true,
        browserBufferTimeout: 1000000
    }, {
        browserBufferTimeout: 1000000
    });
    let url = req.query.url;
    console.log("rtsp url:", url);
    console.log("rtsp params:", req.params);
    try {
        ffmpeg(url)
            .addInputOption("-rtsp_transport", "tcp", "-buffer_size", "102400")  // 这里可以添加一些 RTSP 优化的参数
            .on("start", function () {
                console.log(url, "Stream started.");
            })
            .on("codecData", function (data) {
                console.log(url, "Stream codecData.")
                console.log(data)
             // 摄像机在线处理
            })
            .on('stderr', function (stderrLine) {
                console.log('Stderr output: ' + stderrLine);
            })
            .on("error", function (err, stdout, stderr) {
                console.log(url, "An error occured: ", err.message);
                console.log(url, "stdout: ", stdout);
                console.log(url, "stderr: ", stderr);
            })
            .on("end", function (stdout, stderr) {
                console.log(url, "Stream end!");
             // 摄像机断线的处理
            })
            .outputFormat("flv").videoCodec('libx264').audioCodec("copy").pipe(stream);
            
        // ffmpeg(url) 
        // // .videoCodec('copy')
        // .audioCodec('copy')
        // .on('error', function (err) {
        //     console.log('An error occurred: ' + err.message);
        // })
        // .on('end', function () {
        //     console.log('Processing finished!');
        // })
        // .save('front/static/outtest.flv');
    } catch (error) {
        console.log(error);
    }
}
localServer();