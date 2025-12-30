
'use client';
import Image from 'next/image';
function ImageComponent({src,width,height,alt,className,...props}) {
    const source = src?.includes('https')?src:process.env.NEXT_PUBLIC_ASSET_REVERSE+src
    return <Image 
    src={source} 
    width={width} 
    height={height} 
    className={className}
    alt={alt}
    {...props}/>
}

export default ImageComponent;
  