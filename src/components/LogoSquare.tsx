import React from 'react'
import Image from 'next/image'

const LogoSquare = (props: any) => {
    return (
        <div className={props.className}>
            <Image
                src={'/GoTilo.png'}
                alt="GoTilo Logo"
                fill
                className='object-contain w-full h-full'
            />
        </div>
    )
}

export default LogoSquare