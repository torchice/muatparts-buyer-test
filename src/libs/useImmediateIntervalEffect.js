import { useEffect } from "react";

const useImmediateIntervalEffect = (callback, intervalTime) => {
  useEffect(() => {
    // Call the function immediately
    callback();

    // Set up the interval with the provided intervalTime
    const interval = setInterval(() => {
      callback();
    }, intervalTime);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [callback, intervalTime]);
};

export default useImmediateIntervalEffect