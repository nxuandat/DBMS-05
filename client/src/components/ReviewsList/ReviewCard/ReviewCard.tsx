// import Ratings from "@/app/utils/Ratings";
import React, { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate"; // import thư viện AutoAnimate

import  { FC } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { BsStarHalf } from 'react-icons/bs';

type Props = {
  item: any;
};

type PropsRating = {
    rating: number;
}

const Ratings:FC<PropsRating> = ({ rating }) => {
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <AiFillStar
            key={i}
            size={20}
            color="#f6b100"
            className="mr-2 cursor-pointer"
          />
        );
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(
          <BsStarHalf
            key={i}
            size={17}
            color="#f6ba00"
            className="mr-2 cursor-pointer"
          />
        );
      } else {
        stars.push(
          <AiOutlineStar
            key={i}
            size={20}
            color="#f6ba00"
            className="mr-2 cursor-pointer"
          />
        );
      }
    }
    return <div className="flex mt-1 ml-2 800px:mt-0 800px:ml-0"> {stars}</div>;
  };


const ReviewCard = (props: Props) => {
  const parentRef = useRef(null); // tạo một tham chiếu đến phần tử cha

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current); // truyền tham chiếu vào hàm autoAnimate
    }
  }, [parentRef]);

  return (
    <div ref={parentRef} className="w-full h-max pb-4  dark:bg-slate-500 dark:bg-opacity-[0.20] border border-[#00000028] dark:border-[#ffffff1d] backdrop-blur shadow-[bg-slate-700] rounded-lg p-3 shadow-inner">
      <div className="flex w-full">
        <img
          src={props.item.avatar}
          alt=""
          width={50}
          height={50}
          style={{ borderRadius: '50%' }}
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        <div className="800px:flex justify-between w-full hidden">
          <div className="pl-4">
            <h5 className="text-[20px] text-black dark:text-white">
              {props.item.name}
            </h5>
            <h6 className="text-[16px] text-[#000] dark:text-[#ffffffab]">
              {props.item.profession}
            </h6>
          </div>
          <Ratings rating={5} />
        </div>
      </div>
      <p
        className="pt-2 px-2 font-Poppins
      text-black dark:text-white
      "
      >
        {props.item.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
