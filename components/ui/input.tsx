import React from 'react'


type inputProps = {
    size: '1' | '2' | '3' | '4' | '5' | '6' | '7' | 'full',
    id: string,
    label: string
}


const input = ({ size, id, label }: inputProps) => {
    return (
        <div className={`sm:col-span-${size}`}>
            <label
                htmlFor={id}
                className='block text-sm font-bold leading-6 text-gray-900'
            >
                {label}
            </label>
            <div className='block'>
                <input
                    id={id}
                    type='text'
                    className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
             focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
             placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                />
                {errors.state?.message && (
                    <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.state.message}
                    </p>
                )}
            </div>

        </div>
    )
}

export default input