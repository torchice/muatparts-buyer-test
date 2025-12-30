'use client'
import { useEffect, useState } from 'react';
import Input from '../Input/Input';
import useInputStore from '@/store/zustand/example';
import './style.css';
import useLoadingStore from '@/store/zustand/loading';
import useNavbarCountStore from '@/store/zustand/navbarCount';

export default function Operations(){
    const {
        name, 
        age,
        updateName,
        updateAge,
    } = useInputStore();

    const { showLoading, updateShow } = useLoadingStore();

    const {active, count, updateCount, updateActive} = useNavbarCountStore();

    const [input, setInput] = useState({
        text: name,
        number: age,
        file: null
    });

    const handleInputChange = (type, e) => {
        //console.log('VALUE', e.target.value || e.target.files);
        if(type === 'text'){
            updateName(e.target.value);
            setInput((prevState) => ({...prevState, text: e.target.value}));
        }
        if(type === 'number'){
            updateAge(e.target.value);
            setInput((prevState) => ({...prevState, number: e.target.value}));
        }
        if(type === 'file'){
            setInput((prevState) => ({...prevState, file: e.target.files}));
        }
    }

    const submitInput = () => {
        updateShow(!showLoading);
        // if(!input.text){
        //     console.log('text empty');
        // }
        // if(!input.number){
        //     console.log('number empty');
        // }
        // if(!input.file){
        //     console.log('file empty');
        // }
    }

    useEffect(() => {
        updateCount(5);
    },[])

    const movePage = (value) => {
        updateActive(value)
    }

    return(
        <>
            <h1>Input Example</h1>
            <Input className="textInput" type="text" placeholder="Name" value={input.text} changeEvent={(e) => handleInputChange('text', e)}/>
            <Input className="textInput" type="number" placeholder="Age" value={input.number} changeEvent={(e) => handleInputChange('number', e)}/>
            <input type="file" onChange={(e) => handleInputChange('file', e)}/>
            <button className='bg-[blue]' onClick={submitInput}>toggle loading</button>
            <button onClick={() => movePage(1)}>move page 1</button>
            <button onClick={() => movePage(2)}>move page 2</button>
            <button onClick={() => movePage(3)}>move page 3</button>
            <div className='border border-blue-300 shadow rounded-md max-w-sm w-full mx-auto'>
                <div className='animate-pulse flex space-x-4'>
                    <div className='bg-[grey] w-full'>
                        <h1 className='textInput'>input</h1>
                    </div>
                </div>
            </div>
        </>
    )
}