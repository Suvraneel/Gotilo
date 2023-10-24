import dynamic from 'next/dynamic';
import React from 'react'

const Spline = dynamic(() => import("@splinetool/react-spline"), {
    ssr: false,
});

const Spliner = ({scene}:{scene:string}) => {
    return (
        <div className='w-full h-11/12 absolute bg-transparent -z-10'>
            <Spline scene={scene} />
        </div>
    )
}

export default Spliner