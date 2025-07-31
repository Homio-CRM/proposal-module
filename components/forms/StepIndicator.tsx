'use client'

import React from 'react'
import { FormStepConfig } from '@/config/formFields'

interface StepIndicatorProps {
    steps: FormStepConfig[]
    currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <nav aria-label="Progress" className="mt-6">
            <ol role="list" className="space-y-4 md:flex md:space-y-0">
                {steps.map((step, index) => (
                    <li key={step.id} className="">
                        <div className="group flex justify-center items-center w-full flex-row border-l-2 border-gray-200 py-2 transition-colors md:border-l-0 mr-4">
                            <div className={`flex justify-center items-center size-[30px] rounded-full ${currentStep === steps.length - 1
                                ? "bg-gradient-to-r from-purple-600 to-blue-500"
                                : currentStep > index
                                    ? "bg-gradient-to-r from-purple-600 to-blue-500"
                                    : "bg-gray-50"
                                }`}>
                                <span className={`text-base font-medium ${currentStep === steps.length - 1
                                    ? "text-white"
                                    : currentStep > index
                                        ? "text-white"
                                        : "text-gray-600"
                                    }`}>
                                    {step.id}
                                </span>
                            </div>
                            {index === steps.length - 1 ? "" : (
                                <div className={`w-[100px] h-[6px] bg-gray-50 ml-4 rounded-full ${currentStep > index ? "bg-gradient-to-r from-purple-600 to-blue-500" : "bg-gray-50"
                                    }`}></div>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )
}