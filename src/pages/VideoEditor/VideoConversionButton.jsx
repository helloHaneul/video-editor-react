import { useState } from 'react';
import { fetchFile } from '@ffmpeg/ffmpeg';
import { readFileAsBase64, sliderValueToVideoTime } from '../../utils/utils';

import { Button, Switch, Radio } from 'antd';
import styles from './VideoConversionButtons.module.css'
import { 
    BsVolumeMute,
    BsVolumeUp,
    BsSymmetryHorizontal,
    BsSymmetryVertical,
    BsArrowCounterclockwise,
} from 'react-icons/bs'
import {
    MdGifBox,
    MdDownload,
    MdOutlineVoicemail
} from 'react-icons/md'

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
    const [flipVal, setFlipValue] = useState('NONE');
    const onFlipRadioChange = (e) => {
        console.log(e.target.value);
        setFlipValue(e.target.value);
    }

    // [질문] 상위 컴포넌트에서 동일한 상태값을 관리하는데 여기에다 해도 괜찮나?
    const [isVolumeUp, setMute] = useState(true);

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

        const args = [
            "-ss",
            `${minTime}`,
            "-i",
            "input.mp4",
            "-t", 
            `${maxTime}`,
        ];

        switch(flipVal) {
            case 'HFLIP':
                args.push("-vf");
                args.push("vflip");
                args.push("-c:a", "copy");
                break;
            case 'VFLIP':
                args.push("-vf");
                args.push("hflip");
                args.push("-c:a", "copy");
                break;
            default:
                args.push("-c", "copy");
        }

        console.log(`isVolumeUp - ${isVolumeUp}`);
        if(!isVolumeUp) {
            args.push("-an");
        } 

        await ffmpeg.run(...args, "output.mp4");

        const data = ffmpeg.FS('readFile', 'output.mp4');
        const dataURL = await readFileAsBase64(new Blob([data.buffer], { type: 'video/mp4' }));

        const link = document.createElement('a');
        link.href = dataURL;
        link.setAttribute('download', '');
        link.click();

        onConversionEnd(false);
    };

    return (
        <>
            <div>
                <div style={{ width: '100%', marginBottom: 32, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', marginBottom: 16 }}>
                        <p style={{ marginRight: 30 }}>소리 켜기/끄기</p>
                        <Switch 
                            checkedChildren={<BsVolumeUp />}
                            unCheckedChildren={<BsVolumeMute />}
                            checked={isVolumeUp}
                            onChange={() => {
                                setMute(!isVolumeUp);
                                onVideoMute();
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', marginBottom: 16 }}>
                        <p style={{ marginRight: 45 }}>화면 돌리기</p>
                        <Radio.Group onChange={onFlipRadioChange} value={flipVal}>
                            <Radio value={'NONE'}>
                                <p>No Effect</p>
                            </Radio>
                            <Radio value={'HFLIP'}>
                            {
                                (flipVal === 'HFLIP') ? (
                                    <BsSymmetryHorizontal style={{ color: 'red', fontWeight: 'bold' }} />
                                ) : (
                                    <BsSymmetryHorizontal />
                                )
                            }
                            </Radio>
                            <Radio value={'VFLIP'}>
                            {
                                (flipVal === 'VFLIP') ? (
                                    <BsSymmetryVertical style={{ color: 'red', fontWeight: 'bold' }} />
                                ) : (
                                    <BsSymmetryVertical />
                                )
                            }
                            </Radio>
                        </Radio.Group>
                    </div>
                    
                    <Button onClick={() => {
                        setFlipValue('NONE');
                        setMute(true);
                    }}>
                        옵션 초기화<BsArrowCounterclockwise />
                    </Button>
                </div>
                <div style={{ display: 'flex', width: '100%', gap: 32 }}>
                    <Button onClick={() => onCutTheVideo()} className={styles.out__btn}>
                        <MdDownload />
                        <p>비디오 저장하기</p>
                    </Button>

                    <Button className={styles.out__btn}>
                        <MdOutlineVoicemail />
                        <p>음성만 내보내기</p>
                    </Button>

                    <Button onClick={() => convertToGif()} className={styles.out__btn}>
                        <MdGifBox />
                        <p>GIF 내보내기</p>
                    </Button>
                </div>
            </div>            
        </>
    );
}

export default VideoConversionButton;
