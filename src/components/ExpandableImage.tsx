import React, { useState } from 'react'

type expandableImageProps = {
    onMinimizeClass?: string
    src: string
    alt?: string
    isOpenTab?: boolean
}

const ExpandableImage = ({ onMinimizeClass, src, alt, isOpenTab }: expandableImageProps): React.ReactElement => {
    const [isMax, setIsMax] = useState<boolean>(false)

    return (
        <>
            <img
                src={src}
                className={`cursor-pointer ${onMinimizeClass ?? ""}`}
                onClick={() => isOpenTab ? window.open(src) :setIsMax(true)}
                alt={alt}
            >
            </img>

            {isMax && (
                <>
                    <div
                        onKeyDown={() => { }}
                        onClick={() => setIsMax(false)}
                        role="button"
                        tabIndex={0}
                        className="cursor-default w-[100vw] h-[100vh] fixed top-0 left-0 z-[50] rounded-xl bg-white opacity-65"
                    ></div>
                    <div className="fixed z-[50] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-between items-center flex flex-col gap-5 rounded-xl bg-[#DFF1FD] p-5">
                        <img
                            src={src}
                            className="object-contain object-center"
                            alt={alt}
                        />
                        <div className="flex w-full justify-center">
                            <button
                                onClick={() => setIsMax(false)}
                                className="px-[20px] py-[3px] rounded-[8px] font-[600] text-white bg-[#1F5FFF]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default ExpandableImage