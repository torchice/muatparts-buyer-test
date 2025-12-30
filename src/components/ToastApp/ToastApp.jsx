import Image from "next/image";

import iconWarning from './assets/iconWarning.svg';
import iconSuccess from './assets/iconSuccess.svg';
import toastClose from './assets/toastClose.svg';
import { useEffect } from "react";

const ToastApp = ({
    status = 'success',
    text = '',
    show = false,
    setShow,
    timer = 1000,
    onClose = () => {

    },
    classname,
    bottom,
    right,
    isFixed
}) => {

    useEffect(() => {
        let showTimer = null;
        if(show && timer > 0){
            showTimer = setTimeout(() => {
                onClose();
            },timer)
        }
        else if(!show){
            clearTimeout(showTimer);
        }
    },[show, setShow, timer]);

    return (
        <div style={{bottom:bottom,right:right}} className={`${isFixed?'fixed':'absolute'} bottom-0 left-0 ${classname}`}>
            <div className={'w-screen h-full relative flex items-end justify-center px-[16px] pb-[29px]'}>
                <div className={`${status === 'error' ? 'bg-[#FFE9ED] border-[#EE4343]': 'bg-[#E3F5ED]  border-[#0FBB81]'} 
                ${show ? 'flex' : 'hidden'}
                border-[1px] rounded-[6px] w-full z-[100] max-w-[328px] p-[12px] items-center gap-[12px] justify-between`}>
                    {(status === 'error') ?
                        <Image width={18} height={18} alt="stat" src={iconWarning}/>
                    :
                        <Image width={18} height={18} alt="stat" src={iconSuccess}/>
                    }
                    {
                        text && 
                        <span className={'text-[#000000] text-[12px] font-[600] leading-[14.4px] grow max-w-[238px]'}>
                            {text}
                        </span>
                    }
                    <button onClick={onClose}>
                        <Image width={18} height={18} alt="stat" src={toastClose}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ToastApp;