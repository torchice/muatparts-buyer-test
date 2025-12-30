
'use client';

import Input from '../Input/Input';
import style from './DefaultInputMobile.module.scss'
function DefaultInputMobile({
    classname,
    label,
    onChange,
    value,
    placeholder,
    iconsInput,
    focusEvent,
    isError,
    isOptional,
    supportiveText={left:'',right:''},
    type="input",
    ...props
}) {
    return (
        <div className={`${style.main} flex flex-col gap-4 ${classname}`}>
            <span className='semi-sm text-neutral-900'>{label} {isOptional&&<span className='text-[10px] font-semibold'>(Optional)</span>}</span>
            {type==='input'&&<div className='relative'>
                <Input focusEvent={focusEvent} icon={iconsInput} classname={`w-full ${isError?'input-error':''}`} value={value} changeEvent={onChange} placeholder={placeholder} {...props} />
                {supportiveText.left?<span className='text-neutral-600 medium-xs left-0 top-8 absolute'>{supportiveText.left}</span>:''}
                {supportiveText.right?<span className='text-neutral-600 medium-xs right-0 top-8 absolute'>{supportiveText.right}</span>:''}
            </div>}
            {type==='textarea'&&<div className='relative'>
                <textarea onFocus={focusEvent} placeholder={placeholder} value={value} onChange={onChange} className={` ${style.textarea} ${isError?'input-error':''}`} {...props}></textarea>
                {supportiveText.left?<span className='text-neutral-600 medium-xs left-0 top-14 absolute'>{supportiveText.left}</span>:''}
                {supportiveText.right?<span className='text-neutral-600 medium-xs right-0 top-14 absolute'>{supportiveText.right}</span>:''}
            </div>}
        </div>
    );
}

export default DefaultInputMobile;
  