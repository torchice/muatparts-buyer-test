
'use client';
import { useEffect, useState } from 'react';
import IconComponent from '../IconComponent/IconComponent';
import style from './CountDownMobile.module.scss'
function CountDownMobile({date,classname,withoutIcon=false}) {
    const targetDate = new Date(date);
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
        isTimeUp: false,
    });
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const gapDate = targetDate - now;
            if (gapDate <= 0) {
                clearInterval(interval); 
                setTimeLeft({
                hours: 0,
                minutes: 0,
                seconds: 0,
                isTimeUp: true,
                });
                return;
            }
            const hours = Math.floor((gapDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((gapDate % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((gapDate % (1000 * 60)) / 1000);
            setTimeLeft({
                hours,
                minutes,
                seconds,
                isTimeUp: false,
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);
    return (
        <div className={`${style.main} bg-error-50 rounded-md py-1 px-2 flex items-center gap-1 h-6 ${classname}`}>
            {!withoutIcon&&<IconComponent src={'/icons/time.svg'} width={14} height={14} classname={'icon-error-400'} />}
            <span className='semi-sm text-error-400'>{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</span>
        </div>
    );
}

export default CountDownMobile;
  