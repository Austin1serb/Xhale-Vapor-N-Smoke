import { useCallback, useRef } from 'react';

const useThrottle = (callback, delay) => {
    const lastCall = useRef(null);
    const timeout = useRef(null);

    const throttledFunction = useCallback((...args) => {
        const now = Date.now();
        if (lastCall.current && now < lastCall.current + delay) {
            clearTimeout(timeout.current);
            timeout.current = setTimeout(() => {
                lastCall.current = now;
                callback(...args);
            }, delay + lastCall.current - now);
        } else {
            lastCall.current = now;
            callback(...args);
        }
    }, [callback, delay]);

    return throttledFunction;
};

export default useThrottle;
