import React from "react";

const mobileRegex = [
    /Android/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
];

const useUserAgent = () => {
    let userAgent = navigator.userAgent;

    return mobileRegex.some(mobile => userAgent.match(mobile)) ? 'mobile' : 'non-mobile';
}

export default useUserAgent;