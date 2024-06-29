// 김하늘
import React from "react"
import { useRef, useState, useEffect } from "react";

import { createFFmpeg } from '@ffmpeg/ffmpeg'

import ToastContainerView from "../../components/ToastContainerView";
import ModalView from "../../components/ModalView";

import { Button } from "antd";
import styles from './VideoEditor.module.css'
import video_placeholder from '../../assets/images/editor/video_placeholder.png'

import MultiRangeSlider from "../../components/MultiRangeSlider"
import VideoConversionButton from './VideoConversionButton'

import { sliderValueToVideoTime } from "../../utils/utils";

import VideoPlayer from "./VideoPlayer"
import VideoLoader from "./VideoLoader";

const ffmpeg = createFFmpeg({ log: true })

const VideoEditor = () => {
    // ffmpeg library
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

    // video
    const uploadFile = useRef('');
    const [sliderValues, setSliderValues] = useState([0, 100]);
    const [videoPlayerState, setVideoPlayerState] = useState();
    const [videoPlayer, setVideoPlayer] = useState();
    const [videoFile, setVideoFile] = useState();
    const [videoMute, setVideoMute] = useState(false);

    useEffect(() => {
        console.log('Mute - ' + videoMute);
    }, [videoMute])

    // Toast, Modal
    const [show, setShow] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        ffmpeg.load().then(() => {
            setFfmpegLoaded(true);
        })
    }, [])
    
    useEffect(() => {
        if(!videoFile) {
            setVideoPlayerState(undefined);
        }
    }, [videoFile])

    useEffect(() => {
        const min = sliderValues[0];

        if(min !== undefined && videoPlayerState && videoPlayer) {
            videoPlayer.seek(sliderValueToVideoTime(videoPlayerState.duration, min));
        }
    }, [sliderValues])

    useEffect(() => {
        if(videoPlayer && videoPlayerState) {
            const [min, max] = sliderValues;

            const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
            const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

            if(videoPlayerState.currentTime < minTime) {
                videoPlayer.seek(minTime);
            }
            
            if(videoPlayerState.currentTime > maxTime) {
                videoPlayer.seek(minTime);
            }

            //console.log(재생시간' : ' + parseInt(maxTime - minTime));
        }
    }, [videoPlayerState])

    useEffect(() => {
        // when the current videoFile is removed,
        // restoring the default state
        if (!videoFile) {
            setVideoPlayerState(undefined);
            setVideoPlayerState(undefined);
        }
        setSliderValues([0, 100]);
    }, [videoFile]);

    if(!ffmpegLoaded) return <div>load</div>;

    return (
        <article className="layout">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h1 className={styles.title}>Video Edit</h1>
                {
                    videoFile && (
                        <div>
                            <input
                                onChange={(e) => setVideoFile(e.target.files[0])}
                                type="file"
                                accept="video/*"
                                style={{ display: 'none' }}
                                ref={uploadFile}
                            />
                            <Button
                                className={styles.re__upload__btn}
                                style={{ width: 'fit-content' }}
                                onClick={() => uploadFile.current.click()}
                            >
                                비디오 재선택
                            </Button>
                        </div>
                    )
                }
            </div>
            <section>
                {
                    videoFile ? (
                        <VideoPlayer
                            src={videoFile}
                            onPlayerChange={(videoPlayer) => setVideoPlayer(videoPlayer)}
                            onChange={(videoPlayerState) => setVideoPlayerState(videoPlayerState)}
                            isMuted={videoMute}
                        />
                    ) : (
                        <>
                            <img 
                                src={video_placeholder} 
                                alt="비디오를 업로드해주세요." 
                                style={{ width: '100%', height: 'auto', marginBottom: '32px' }} 
                                crossOrigin="use-credentials" 
                            />
                            <VideoLoader 
                                disabled={false}
                                onChange={(videoFile) => setVideoFile(videoFile)}
                            />
                        </>
                    )
                }
                
            </section>
            {
                videoFile && (
                    <>
                        <section
                            style={{
                                width: '100%',
                                marginTop: 30,
                                marginBottom: 62,
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <MultiRangeSlider
                                min={0}
                                max={100}
                                onChange={({min, max}) => {
                                    setSliderValues([min, max]);
                                }}
                            />

                        </section>
                        <section style={{ display: 'flex', gap: 16 }}>
                            <VideoConversionButton 
                                onConversionStart={() => {
                                    setProcessing(true);
                                }}
                                onConversionEnd={() => {
                                    setProcessing(false);
                                    setShow(true);
                                }}
                                onVideoMute={() => {
                                    setVideoMute(!videoMute);
                                }}
                                ffmpeg={ffmpeg}
                                videoPlayerState={videoPlayerState}
                                sliderValues={sliderValues}
                                videoFile={videoFile}
                                onVideoChanged={(newVideo) => {
                                    console.log(newVideo);
                                }}
                            />
                        </section>
                    </>
                )
            }

            <ToastContainerView
                isShow={show}
                handleClose={() => setShow(false)}
            />
            <ModalView 
                isProcessing={processing}
                handleClose={() => setProcessing(false)}
            />
        </article>
    );
}

export default VideoEditor;