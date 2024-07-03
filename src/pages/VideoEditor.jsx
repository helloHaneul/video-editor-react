// 김하늘
import React from 'react';
import { useRef, useState, useEffect } from 'react';

import { createFFmpeg } from '@ffmpeg/ffmpeg';

import { Button, Slider, Modal, message } from 'antd';

import styles from './VideoEditor.module.css';
import video_placeholder from '../assets/images/editor/video_placeholder.png';

import VideoConversionButton from '../components/VideoConversionButton';
import VideoPlayer from '../components/VideoPlayer';
import VideoLoader from '../components/VideoLoader';

import { PlayerContextProvider } from '../context/PlayerContext';

const ffmpeg = createFFmpeg({ log: true });

const VideoEditor = () => {
  // ffmpeg library
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  // video
  const uploadFile = useRef('');
  const playerRef = useRef();
  const [sliderValues, setSliderValues] = useState([0, 100]);
  const [videoPlayerState, setVideoPlayerState] = useState();
  const [videoFile, setVideoFile] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    ffmpeg.load().then(() => {
      setFfmpegLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (videoPlayerState) {
      if (videoPlayerState.currentTime >= sliderValues[1]) {
        playerRef.current.seek(sliderValues[0]);
      }
    }
  }, [videoPlayerState, sliderValues]);

  const handleOnChangePlayerState = (state, prevState) => {
    if (isNaN(state.duration)) return;

    if (isNaN(prevState.duration)) {
      setSliderValues([0, state.duration]); // initial load
    }

    setVideoPlayerState(state);
  };

  const handleOnChangeSliderValues = (values) => {
    if (values[0] === values[1]) {
      return;
    }

    const newValues = [...values];
    if (newValues[1] > videoPlayerState.duration) {
      newValues[1] = videoPlayerState.duration;
    }

    playerRef.current.seek(newValues[0]);

    setSliderValues(newValues);
  };

  if (!ffmpegLoaded) return <div>load</div>;

  // TODO: divide to component
  return (
    <PlayerContextProvider>
      <article className="layout">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h1 className={styles.title}>Video Edit</h1>
          {videoFile && (
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
                onClick={() => uploadFile.current.click()}
              >
                비디오 재선택
              </Button>
            </div>
          )}
        </div>
        <section>
          {videoFile ? (
            <VideoPlayer
              src={videoFile}
              playerRef={playerRef}
              onChange={handleOnChangePlayerState}
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
          )}
        </section>
        {videoFile && playerRef.current && (
          <>
            <section
              style={{
                width: '100%',
                marginTop: 30,
                marginBottom: 62,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Slider
                range
                value={sliderValues}
                min={0}
                max={videoPlayerState?.duration ?? 0}
                onChange={handleOnChangeSliderValues}
                style={{ width: '100%' }}
              />
            </section>
            <section
              style={{
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <VideoConversionButton
                onConversionStart={() => {
                  setIsModalOpen(true);
                }}
                onConversionEnd={() => {
                  setIsModalOpen(false);
                  message.success('내보내기가 완료되었습니다.');
                }}
                ffmpeg={ffmpeg}
                videoPlayerState={videoPlayerState}
                sliderValues={sliderValues}
                videoFile={videoFile}
              />
            </section>
          </>
        )}

        <Modal title="내보내기 진행중" open={isModalOpen}>
          <p>내보내기가 진행중입니다...</p>
          <p>잠시만 기다려주세요......</p>
        </Modal>
      </article>
    </PlayerContextProvider>
  );
};

export default VideoEditor;
