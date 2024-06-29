import { Button } from 'antd';
import { fetchFile } from '@ffmpeg/ffmpeg';
import { readFileAsBase64, sliderValueToVideoTime } from '../../utils/utils';
import out from '../../assets/icons/out.svg';
import dark_download from '../../assets/icons/dark_download.svg';

function VideoConversionButton({
    videoPlayerState,
    sliderValues,
    videoFile,
    ffmpeg,
    onConversionStart = () => {},
    onConversionEnd = () => {},
    onGifCreated = () => {},
    onVideoMute = () => {},
    onVideoChanged = (newVideo) => {},
}) {
    const convertToGif = async () => {
        // starting the conversion process
        onConversionStart(true);

        const inputFileName = 'input.mp4';
        const outputFileName = 'output.gif';

        // writing the video file to memory
        ffmpeg.FS('writeFile', inputFileName, await fetchFile(videoFile));

        const [min, max] = sliderValues;
        const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
        const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

        // cutting the video and converting it to GIF with a FFMpeg command
        await ffmpeg.run('-i', inputFileName, '-ss', `${minTime}`, '-to', `${maxTime}`, '-f', 'gif', outputFileName);
        
        // reading the resulting file
        const data = ffmpeg.FS('readFile', outputFileName);

        // converting the GIF file created by FFmpeg to a valid image URL
        const gifUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));

        const link = document.createElement('a');
        link.href = gifUrl;
        link.setAttribute('download', '');
        link.click();

        // ending the conversion process

        onConversionEnd(false);
    };

    const onCutTheVideo = async () => {
        onConversionStart(true);

        const [min, max] = sliderValues;
        const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
        const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

        ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));

        await ffmpeg.run('-ss', `${minTime}`, '-i', 'input.mp4', '-t', `${maxTime}`, '-c', 'copy', 'output.mp4');
        
        // mute : '-an'
        //await ffmpeg.run('-ss', `${minTime}`, '-i', 'input.mp4', '-t', `${maxTime}`, '-c', 'copy', '-an', 'output.mp4');
        // vflip
        //await ffmpeg.run('-i', 'input.mp4', '-vf', 'vflip', '-c:a', 'copy', 'output.mp4');
        // hfip with mute
        //await ffmpeg.run('-i', 'input.mp4', '-vf', 'hflip', '-c:a', 'copy', '-an', 'output.mp4');
                
        const data = ffmpeg.FS('readFile', 'output.mp4');
        const dataURL = await readFileAsBase64(new Blob([data.buffer], { type: 'video/mp4' }));

        const link = document.createElement('a');
        link.href = dataURL;
        link.setAttribute('download', '');
        link.click();

        onConversionEnd(false);
    };

    // [TODO] preview update to fliped video
    const onFlipView = async () => {
        
        ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));

        await ffmpeg.run('-i', 'input.mp4', '-vf', 'vflip', '-c:a', 'copy', 'output.mp4');
                
        // const data = ffmpeg.FS('readFile', 'output.mp4');
        // const dataURL = await readFileAsBase64(new Blob([data.buffer], { type: 'video/mp4' }));

        // onVideoChanged(dataURL);
    }

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <Button style={{ margin: 8 }} onClick={() => onVideoMute()}>
                    Mute
                </Button>
                <Button onClick={() => onFlipView()}>
                    Flip
                </Button>
            </div>

            <Button onClick={() => onCutTheVideo()} className="gif__out__btn" style={{ marginBottom: 16 }}>
                <img src={dark_download} alt="비디오 저장하기" />
                <p style={{ color: '#383838', fontSize: 16, fontWeight: 700 }}>비디오 저장하기</p>
            </Button>

            <Button onClick={() => convertToGif()} className="gif__out__btn">
                <img src={out} alt="GIF 내보내기" />
                <p style={{ color: '#383838', fontSize: 16, fontWeight: 700 }}>GIF 내보내기</p>
            </Button>

        </>
    );
}

export default VideoConversionButton;
