import { useState } from 'react';
import { fetchFile } from '@ffmpeg/ffmpeg';
import { readFileAsBase64 } from '../utils/utils';

import { Button, Switch, Radio } from 'antd';
import styles from './VideoConversionButtons.module.css';
import {
  BsVolumeMute,
  BsVolumeUp,
  BsSymmetryHorizontal,
  BsSymmetryVertical,
  BsArrowCounterclockwise,
} from 'react-icons/bs';
import { MdGifBox, MdDownload, MdOutlineVoicemail } from 'react-icons/md';

import { usePlayer } from '../context/PlayerContext';

function VideoConversionButton({
  videoPlayerState,
  sliderValues,
  videoFile,
  ffmpeg,
  onConversionStart = () => {},
  onConversionEnd = () => {},
}) {
  const { player, setPlayer } = usePlayer();

  const [flipVal, setFlipValue] = useState('NONE');
  const onFlipRadioChange = (e) => {
    setFlipValue(e.target.value);
  };

  // TODO: remove duplicated codes
  // TODO: move to hooks
  const convertToGif = async () => {
    onConversionStart();

    const inputFileName = 'input.mp4';
    const outputFileName = 'output.gif';

    ffmpeg.FS('writeFile', inputFileName, await fetchFile(videoFile));

    const [min, max] = sliderValues;

    await ffmpeg.run(
      '-i',
      inputFileName,
      '-ss',
      `${min}`,
      '-to',
      `${max}`,
      '-f',
      'gif',
      outputFileName
    );

    const data = ffmpeg.FS('readFile', outputFileName);

    const gifUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' })
    );

    const link = document.createElement('a');
    link.href = gifUrl;
    link.setAttribute('download', '');
    link.click();

    onConversionEnd();
  };

  const onCutTheVideo = async () => {
    onConversionStart();

    const [min, max] = sliderValues;

    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));

    const args = ['-ss', `${min}`, '-i', 'input.mp4', '-to', `${max}`];

    switch (flipVal) {
      case 'HFLIP':
        args.push('-vf');
        args.push('vflip');
        args.push('-c:a', 'copy');
        break;
      case 'VFLIP':
        args.push('-vf');
        args.push('hflip');
        args.push('-c:a', 'copy');
        break;
      default:
        args.push('-c', 'copy');
    }

    if (!player.isVolumeUp) {
      args.push('-an');
    }

    await ffmpeg.run(...args, 'output.mp4');

    const data = ffmpeg.FS('readFile', 'output.mp4');
    const dataURL = await readFileAsBase64(
      new Blob([data.buffer], { type: 'video/mp4' })
    );

    const link = document.createElement('a');
    link.href = dataURL;
    link.setAttribute('download', '');
    link.click();

    onConversionEnd();
  };

  const convertToMp3 = async () => {
    onConversionStart();

    const inputFileName = 'input.mp4';
    const outputFileName = 'output.mp3';

    ffmpeg.FS('writeFile', inputFileName, await fetchFile(videoFile));

    const [min, max] = sliderValues;

    await ffmpeg.run(
      '-i',
      inputFileName,
      '-ss',
      `${min}`,
      '-to',
      `${max}`,
      '-q:a',
      '0',
      '-f',
      'mp3',
      outputFileName
    );

    const data = ffmpeg.FS('readFile', outputFileName);

    const gifUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: 'audio/mp3' })
    );

    const link = document.createElement('a');
    link.href = gifUrl;
    link.setAttribute('download', '');
    link.click();

    onConversionEnd();
  };

  return (
    <>
      <div>
        <div
          style={{
            width: '100%',
            marginBottom: 32,
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', marginBottom: 16 }}>
            <p style={{ marginRight: 30 }}>소리 켜기/끄기</p>
            <Switch
              checkedChildren={<BsVolumeUp />}
              unCheckedChildren={<BsVolumeMute />}
              checked={player.isVolumeUp}
              onChange={() => {
                const _isVolumeUp = !player.isVolumeUp;
                setPlayer({
                  isVolumeUp: _isVolumeUp,
                });
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
                {flipVal === 'HFLIP' ? (
                  <BsSymmetryHorizontal
                    style={{ color: 'red', fontWeight: 'bold' }}
                  />
                ) : (
                  <BsSymmetryHorizontal />
                )}
              </Radio>
              <Radio value={'VFLIP'}>
                {flipVal === 'VFLIP' ? (
                  <BsSymmetryVertical
                    style={{ color: 'red', fontWeight: 'bold' }}
                  />
                ) : (
                  <BsSymmetryVertical />
                )}
              </Radio>
            </Radio.Group>
          </div>

          <Button
            onClick={() => {
              setFlipValue('NONE');
              setPlayer({
                isVolumeUp: true,
              });
            }}
          >
            옵션 초기화
            <BsArrowCounterclockwise />
          </Button>
        </div>
        <div style={{ display: 'flex', width: '100%', gap: 32 }}>
          <Button onClick={() => onCutTheVideo()} className={styles.out__btn}>
            <MdDownload />
            <p>비디오 저장하기</p>
          </Button>

          <Button onClick={() => convertToMp3()} className={styles.out__btn}>
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
