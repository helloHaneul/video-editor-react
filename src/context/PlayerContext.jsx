import { createContext, useState, useContext } from 'react';

// TODO: flip option add
const PlayerContext = createContext({
  player: {
    isVolumeUp: 'true',
  },
  setPlayer: () => {},
});

export function PlayerContextProvider({ children }) {
  const [player, setPlayer] = useState({
    isVolumeUp: 'true',
  });

  return (
    <PlayerContext.Provider
      value={{
        player,
        setPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
