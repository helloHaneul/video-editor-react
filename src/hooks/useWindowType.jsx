import { useState, useLayoutEffect } from 'react';

const useWindowType = () => {
  const [windowType, setWindowType] = useState('pc');

  let screenWidth = window.innerWidth;

  const updateWindowType = () => {
    screenWidth = window.innerWidth;

    if (screenWidth <= 768) {
      setWindowType('mobile');
    }

    if (screenWidth > 768 && screenWidth <= 1024) {
      setWindowType('tablet');
    }

    if (screenWidth > 1024) {
      setWindowType('pc');
    }
  };

  useLayoutEffect(() => {
    updateWindowType();
    window.addEventListener('resize', updateWindowType);

    return () => {
      window.removeEventListener('resize', updateWindowType);
    };
  }, [windowType]);

  return windowType;
};

export default useWindowType;
