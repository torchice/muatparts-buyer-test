
'use client';
import Slider from "react-slick";
import style from './ImageProductSlider.module.scss'
import Image from "next/image";
import CustomLink from "../CustomLink";
const headerImages = [
    "https://placehold.co/500x250/red/white.png",
    "https://placehold.co/500x250/green/white.png",
    "https://placehold.co/500x250/blue/white.png",
  ];
function ImageProductSlider({width=350,height=380}) {
    return (
        <div className={style.main}>
            <Slider 
                customPaging={(i)=>{
                    return (
                        <CustomLink href='/'>
                          <Image width={width} height={height} src={'https://placehold.co/500x250/blue/white.png'} alt={'val'} />
                        </CustomLink>
                      );
                }}
                dots
                dotsClass="slick-dots slick-thumb"
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
             >
                {
                    headerImages?.map(val=>{
                        return(
                        <div key={val}>
                            <Image width={width} height={height} src={val} alt={val} />
                        </div>
                    )})
                }
            </Slider>
        </div>
    );
}

export default ImageProductSlider;
  