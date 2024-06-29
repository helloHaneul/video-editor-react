import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import React, { useEffect } from "react";
import { useState, useLayoutEffect } from 'react'

const mobileRegex = [
    /Android/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
];

const useUserEnv = () => {

    const [env, setEnv] = useState({
        device: '',
        window: '',
    });

    useEffect(() => {
        const userAgent = window.navigator?.userAgent || "";
        setEnv({
            ...env,
            device: mobileRegex.some(mobile => userAgent.match(mobile)) ? 'mobile' : 'non-mobile'
        })
    },[]);

    let screenWidth = window.innerWidth;

    const updateWindowType = () => {
        screenWidth = window.innerWidth;

        let type = '';
        if(screenWidth <= 768) {
            type = 'mobile';
        }

        if(screenWidth > 768 && screenWidth <= 1024) {
            type = 'tablet';
        }

        if(screenWidth > 1024) {
            type = 'pc';
        }
        
        setEnv({
            ...env,
            window: type
        });
    }

    useLayoutEffect(() => {
        updateWindowType();

        window.addEventListener('resize', updateWindowType);

        return () => {
            window.removeEventListener('resize', updateWindowType);
        }
    }, []);

    return env;
}

export default useUserEnv;