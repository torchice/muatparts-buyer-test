
'use client';

import Input from '../Input/Input';
import style from './DefaultInputComponent.module.scss'
import '../../app/globals.scss'
function DefaultInputComponent({
    classname,
    label,
    onChange,
    value,
    placeholder,
    iconsInput,
    focusEvent,
    blurEvent,
    isError,
    isOptional,
    supportiveText={left:'',right:''},
    type="input",
    classTextarea,
    classInput,
    classSuppertiveTextLeft,
    classSuppertiveTextRight,
    classLabel,
    ...props
}) {
    return (
        <div className={`${style.main} flex flex-col gap-4 ${classname}`}>
            <span className={`semi-sm text-neutral-900 ${classLabel}`}>{label} {isOptional&&<span className='text-[10px] font-semibold'>(Optional)</span>}</span>
            {type==='input'&&<div className='relative'>
                <Input focusEvent={focusEvent} icon={iconsInput} classname={`w-full ${isError?'input-error':''} ${classInput}`} value={value} changeEvent={onChange} placeholder={placeholder} {...props} blurEvent={blurEvent} />
                {supportiveText.left?<span className={`medium-xs left-0 top-12 absolute ${isError?'text-error-500':'text-neutral-600'} ${classSuppertiveTextLeft}`}>{supportiveText.left}</span>:''}
                {supportiveText.right?<span className={`medium-xs right-0 top-12 absolute ${isError?'text-error-500':'text-neutral-600'} ${classSuppertiveTextRight}`}>{supportiveText.right}</span>:''}
            </div>}
            {type==='textarea'&&<div className='relative'>
                <textarea onFocus={focusEvent} placeholder={placeholder} value={value} onChange={onChange} className={` ${style.textarea} ${isError?'border border-error-500':''} ${classTextarea}`} {...props}></textarea>
                {supportiveText.left?<span className={`medium-xs left-0 top-14 absolute ${isError?'text-error-500':'text-neutral-600'} ${classSuppertiveTextLeft}`}>{supportiveText.left}</span>:''}
                {supportiveText.right?<span className={`medium-xs right-0 top-14 absolute ${isError?'text-error-500':'text-neutral-600'} ${classSuppertiveTextRight}`}>{supportiveText.right}</span>:''}
            </div>}
        </div>
    );
}

export default DefaultInputComponent;
  