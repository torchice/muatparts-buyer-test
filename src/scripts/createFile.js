const fs = require('fs/promises'); // Use promises for asynchronous operations
const readline = require('readline');
const path = require('path');

function createPage(name) {
  return `
import ${name} from './${name}';

function Page() {
    return (
        <div className='w-full'>
            <${name} />
        </div>
    );
}

export default Page;
  `;
}

function createName(name) {
  return `
'use client'
import { viewport } from '@/store/viewport'
import React, { useState } from 'react'
import ${name}Responsive from './${name}Responsive'
import ${name}Web from './${name}Web'
import SWRHandler from '@/services/useSWRHook'

function ${name}() {
  const [state,setState]=useState()
  const {useSWRHook,useSWRMutateHook}=SWRHandler()
  const {isMobile} = viewport()
  if(typeof isMobile!=='boolean') return <></> //buat skeleton
  if(isMobile) return <${name}Responsive/>
  return <${name}Web/>
}

export default ${name}
  `;
}
function createStyle(name) {
  return `
.main{
    display:flex
}
`;
}

function createNameWeb(name) {
  return `
'use client';
import style from './${name}.module.scss'
function ${name}Web() {
    return (
        <div className={style.main}>${name} Web</div>
    );
}

export default ${name}Web;
  `;
}
function createNameOther(name) {
  return `
'use client';
import style from './${name}.module.scss'
function ${name}() {
    return (
        <div className={style.main}>${name} </div>
    );
}

export default ${name};
  `;
}

function createNameResponsive(name) {
  return `
import { useHeader } from '@/common/ResponsiveContext'
import React, { useEffect } from 'react'
import style from './${name}.module.scss'
function ${name}Responsive() {
  const {
    appBarType, //pilih salah satu : 'header_title_secondary' || 'header_search_secondary' || 'default_search_navbar_mobile' || 'header_search' || 'header_title'
    appBar, // muncul ini : {onBack:null,title:'',showBackButton:true,appBarType:'',appBar:null,header:null}
    renderAppBarMobile, // untuk render komponen header mobile dengan memasukkanya ke useEffect atau by trigger function / closer
    setAppBar, // tambahkan payload seperti ini setAppBar({onBack:()=>setScreen('namaScreen'),title:'Title header',appBarType:'type'})
    handleBack, // dipanggil di dalam button di luar header, guna untuk kembali ke screen sebelumnya 
    clearScreen,// reset appBar
    setScreen, // set screen
    screen, // get screen,
    search, // {placeholder:'muatparts',value:'',type:'text'}
    setSearch, // tambahkan payload seperti ini {placeholder:'Pencarian',value:'',type:'text'}
  }=useHeader()
  useEffect(()=>{
    window.scrollTo(0,0)
    if(screen==='example2'){
      setAppBar({
        title:'Example 2',
        appBarType:'header_search',
        onBack:()=>{
        setScreen('example')
          setAppBar({
            title:'Example',
            appBarType:'header_title',
            onBack:()=>clearScreen()
          })
        }
      })
      setSearch({
        placeholder:'Pencarian Example 2'
      })
    }
    if(screen==='example3'){
      setAppBar({
        title:'Example 3',
        appBarType:'header_title_secondary',
        onBack:()=>setScreen('example2')
      })
    }
    if(screen==='example4'){
      setAppBar({
        title:'Example 4',
        appBarType:'header_search_secondary',
        onBack:()=>setScreen('example3')
      })
      setSearch({
        placeholder:'Pencarian Example 4'
      })
    }
  },[screen])
  if (screen==='example') return (
    <div className=' flex flex-col'>
      <p>Example</p>
      <button className='bg-primary-600' onClick={()=>{setScreen('example2')}}>Go to Example 2</button>
    </div>
  )
  if (screen==='example2') return (
    <div className=' flex flex-col'>
      <p>Example 2</p>
      <button className='bg-primary-600' onClick={()=>setScreen('example3')}>Go to Example 3</button>
    </div>
  )
  if (screen==='example3') return (
    <div className=' flex flex-col'>
      <p>Example 3</p>
      <button className='bg-primary-600' onClick={()=>setScreen('example4')}>Go to Example 4</button>
    </div>
  )
  if (screen==='example4') return (
    <div className=' flex flex-col'>
      <p>Example 4</p>
    </div>
  )
  // main screen
  return (
    <div className={style.main}>
      <button className='bg-primary-600' onClick={()=>{
        setScreen('example')
        setAppBar({
          title:'Example',
          appBarType:'header_title',
          onBack:()=>clearScreen()
        })
      }} >To example Screen</button>
      <p>${name} Responsive</p>

    </div>
  )
}

export default ${name}Responsive
  `;
}

async function scanDir(pathDir) {
  try {
    const files = await fs.readdir(pathDir);
    const dirs = files.filter((a) => a === 'app' || a === 'containers' || a === 'components');

    if (dirs.length === 0) {
      console.log('No valid directories found.');
      return;
    }

    dirs.forEach((dir, i) => {
      console.log(`${i + 1}. ${dir}`);
    });

    // Create a single readline interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Choose Directory: ', async (dirIndex) => {
      const index = parseInt(dirIndex, 10) - 1;

      if (isNaN(index) || index < 0 || index >= dirs.length) {
        console.log('Blok....');
        rl.close();
        return;
      }

      const chosenDir = dirs[index];
      const chosenDirPath= path.join(pathDir, chosenDir);
      console.log(`You choose: ${chosenDir}`);

      rl.question('Write Name of File: ', async (name) => {
        const dirPath = path.join(chosenDirPath, name==='app'?name.toLowerCase():name);
        const fileWeb = path.join(dirPath, `${name.charAt(0).toUpperCase()+name.slice(1)}Web.jsx`);
        const fileMobile = path.join(dirPath, `${name.charAt(0).toUpperCase()+name.slice(1)}Responsive.jsx`);
        const fileName = path.join(dirPath, `${name.charAt(0).toUpperCase()+name.slice(1)}.jsx`);
        const fileStyle = path.join(dirPath, `${name.charAt(0).toUpperCase()+name.slice(1)}.module.scss`);
        const filePage = path.join(dirPath, `page.jsx`);
        const fileIndex = path.join(dirPath, `${name.charAt(0).toUpperCase()+name.slice(1)}.jsx`);

        try {
            await fs.mkdir(dirPath, { recursive: true });
            console.log(`Directory ${dirPath} created.`);
            if(chosenDir==='app'){
                await Promise.all([
                    fs.writeFile(filePage, createPage(name.charAt(0).toUpperCase()+name.slice(1)), 'utf8'),
                    fs.writeFile(fileName, createName(name.charAt(0).toUpperCase()+name.slice(1)), 'utf8'),
                    fs.writeFile(fileWeb, createNameWeb(name.charAt(0).toUpperCase()+name.slice(1)), 'utf8'),
                    fs.writeFile(fileStyle, createStyle(name.charAt(0).toUpperCase()+name.slice(1)), 'utf8'),
                    fs.writeFile(fileMobile, createNameResponsive(name.charAt(0).toUpperCase()+name.slice(1)), 'utf8'),
                ]);
            }else{
                await Promise.all([
                    fs.writeFile(fileStyle, createStyle(name), 'utf8'),
                    fs.writeFile(fileIndex, createNameOther(name), 'utf8'),
                ]);
            }

            console.log('Files created successfully!');
        } catch (err) {
            console.error('Error creating files:', err.message);
        }

        rl.close();
      });
    });
  } catch (error) {
    console.error('Error scanning directory:', error.message);
  }
}

// Scan the `./src` directory
scanDir('./src');
