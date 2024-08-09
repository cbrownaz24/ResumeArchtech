import React from "react";

const FormStepper = () => {
    const steps = ['Personal', 'Education', 'Experience', 'Projects']
    return (
        <div className='flex justify-center items-center bg-slate-300 p-3'>
            <div className='flex justify-center w-1/2'>
                {steps.map((step, index) => (
                    <div key={index} className='flex-col justify-center items-center p-3 bg-blue-100 border-2'>
                        <div className='flex justify-center items-center w-10 h-10 bg-gray-200 rounded-full'>
                            {index + 1}
                        </div>
                        <div className='flex justify-center items-center'>
                            {step}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormStepper;