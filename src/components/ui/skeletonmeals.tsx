import React from 'react'
import { Skeleton } from './skeleton'

const Skeletonmeals = () => {
    return (
            <Skeleton>
                <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">

                    {/* Image Skeleton */}
                    <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
                    </div>

                    {/* Content Skeleton */}
                    <div className="p-4 space-y-3">

                        <div className="h-5 w-3/4 bg-gray-200 rounded-md relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
                        </div>

                        <div className="h-4 w-1/3 bg-gray-200 rounded-md relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
                        </div>

                        <div className="h-3 w-1/4 bg-gray-200 rounded-md relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
                        </div>

                    </div>
                </div>
            </Skeleton>

    )
}

export default Skeletonmeals
