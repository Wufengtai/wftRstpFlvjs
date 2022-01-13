<template>
    <div>
        <video  id ="videoElement"  class="demo-video" ref="player" muted autoplay></video>
    </div>
</template>
<script>
import flvjs from "flv.js";
export default {
    data () {
        return {
          id: "1",
        //   rtsp: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov",
        rtsp: "rtsp://admin:Hyt123456@192.168.111.14:554/Streaming/Channels/102?transportmode=unicast&profile=Profile_1",
        player: null
        }
    },
    mounted () {
        if (flvjs.isSupported()) {
            console.log("查看"+flvjs.isSupported())
            let video = this.$refs.player;
            if (video) {
                this.player = flvjs.createPlayer({
                    type: "flv",
                    isLive: true,
                    url: `ws://192.168.111.168:8888/rtsp/${this.id}/?url=${this.rtsp}`,
                    enableStashBuffer: false
                },
                {
                    enableWorker: false, //不启用分离线程
                    enableStashBuffer: false, //关闭IO隐藏缓冲区
                    lazyLoad: false,
                }
                );
                this.player.attachMediaElement(video);
                try {
                    this.player.load();
                    this.player.play();
                } catch (error) {
                    console.log(error);
                };
            }
            // if (video) {
            //     this.player = flvjs.createPlayer({
            //         type: "flv",
            //         url: `static/test.flv`
            //     });
            //     this.player.attachMediaElement(video);
            //     try {
            //         this.player.load();
            //         this.player.play();
            //     } catch (error) {
            //         console.log(error);
            //     };
            // }
        }
        if(this.player!=undefined){
            this.flvSetTime()
            // this.player.on("statistics_info", function (res) {
            //     if (this.lastDecodedFrame == 0) {
            //         this.lastDecodedFrame = res.decodedFrames;
            //         return;
            //     }
            //     if (this.lastDecodedFrame != res.decodedFrames) {
            //         this.lastDecodedFrame = res.decodedFrames;
            //     } else {
            //         this.lastDecodedFrame = 0;
            //         if (this.player) {
            //             this.player.pause();
            //             this.player.unload();
            //             this.player.detachMediaElement();
            //             this.player.destroy();
            //             this.player= null;
            //             this.createPlayer(videoElement, this.url);
            //         }
            //     }
            //     });
        }
    },
    methods:{
        flvSetTime(){
            // setInterval(() => {
            //     if (this.player.buffered.length) {
            //         let end = this.player.buffered.end(0);//获取当前buffered值
            //         let diff = end - this.player.currentTime;//获取buffered与currentTime的差值
            //         if (diff >= 0.5) {//如果差值大于等于0.5 手动跳帧 这里可根据自身需求来定
            //         this.player.currentTime = this.player.buffered.end(0) - 1;//手动跳帧
            //     }
            //     }
            //     }, 1000); //2000毫秒执行一次  
            let player = document.getElementById('videoElement');
            setInterval(() => {
                const end = player.buffered.end(0);  // 视频结尾时间
                const current = player.currentTime;  //  视频当前时间
                const diff = end - current;// 相差时间
                console.log("********difffff**********",diff); 
                const diffCritical = 2; // 这里设定了超过4秒以上就进行跳转
                const diffSpeedUp = 0.5; // 这里设置了超过1秒以上则进行视频加速播放
                const maxPlaybackRate = 5;// 自定义设置允许的最大播放速度
                let playbackRate = 1.0; // 播放速度
                if (diff > diffCritical) {
                console.log("相差超过4秒，进行跳转");
                player.currentTime = end - 1.5;
                playbackRate = Math.max(1, Math.min(diffCritical, 16));
                } else if (diff > diffSpeedUp) {
                console.log("相差超过1秒，进行加速");
                playbackRate = Math.max(1, Math.min(diff, maxPlaybackRate, 16))
                }
                player.playbackRate = playbackRate;
                if (player.paused) {
                    this.player.play()
                }
            }, 500)
        }
    },
    destruction() {
        //销毁对象
        if (this.player) {
            this.player.pause();
            this.player.destroy();
            this.player = null;
        }
    },
}
</script>
<style>
    .demo-video {
        max-width: 880px; 
        max-height: 660px;
    }
</style>