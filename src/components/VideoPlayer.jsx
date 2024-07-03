// 김하늘
import React, { useEffect, useState } from 'react';

import { Player, BigPlayButton, LoadingSpinner, ControlBar } from 'video-react';

import { usePlayer } from '../context/PlayerContext';

import 'video-react/dist/video-react.css';

const VideoPlayer = ({ src, playerRef, onChange, startTime = undefined }) => {
  const [source, setSource] = useState();
  const { player } = usePlayer();

  useEffect(() => {
    setSource(URL.createObjectURL(src));
  }, [src]);

  return (
    <div>
      <Player
        fluid={true}
        ref={(player) => {
          if (player && playerRef.current !== player) {
            playerRef.current = player;
            playerRef.current.subscribeToStateChange(onChange);
          }
        }}
        startTime={startTime}
        src={source}
        muted={!player.isVolumeUp}
      >
        <source src={source} />
        <BigPlayButton position="center" />
        <LoadingSpinner />
        <ControlBar disableCompletely></ControlBar>
      </Player>
    </div>
  );
};

export default VideoPlayer;
