'use client'
import { useEffect, useState } from 'react'
import IconComponent from '../IconComponent/IconComponent'
import style from './ButtonPlusMinus.module.scss'

function ButtonPlusMinus({ number = 0, increment, decrement, min = 0, max, disable, disableMax, disableMin, onNumber=()=>{}, disableInput }) {
    const [state, setState] = useState(number)

    useEffect(() => {
        if (typeof number === 'number') setState(number)
    }, [number])

    const incrementFn = () => {
        if (disable || (max !== undefined && state >= max) || disableMax) return
        setState(prev => prev + 1)
        if (increment) increment(state + 1)
    }

    const decrementFn = () => {
        if (disable || state <= min || disableMin) return
        setState(prev => prev - 1)
        if (decrement) decrement(state - 1)
    }
    useEffect(() => {
        onNumber(state)
    }, [state])
    return (
        <div className={`${style.main} flex w-[110px] h-8 px-3 items-center border border-neutral-600 rounded-md justify-between ${disable ? 'bg-neutral-200' : ''}`}>
            <span onClick={decrementFn} className={`${disable ? '' : 'cursor-pointer'}`}>
                <IconComponent src={'/icons/minus-small.svg'} />
            </span>
            {disableInput?<span className='medium-xs'>{isNaN(state)?0:state}</span>:<input 
            type='number'
            className='text-neutral-900 font-medium text-xs select-none outline-none w-full max-w-4' 
            value={isNaN(state)?0:state} 
            onChange={a => {
                // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer LB - 0205
                if (/^\d*$/.test(a.target.value)) setState(a.target.value.replace(/^0+/, "") || "0")
                if (parseInt(a.target.value) > max) setState(max)
                if (parseInt(a.target.value) < 0) setState(0)
                setState(parseInt(a.target.value))
            }}
            onBlur={a=>{
                if (parseInt(a.target.value) > max) setState(max)
                if (parseInt(a.target.value) < 0) setState(0)
            }} />}
            <span onClick={incrementFn} className={`${disable ? '' : 'cursor-pointer'}`}>
                <IconComponent src={'/icons/plus-small.svg'} />
            </span>
        </div>
    )
}

export default ButtonPlusMinus
