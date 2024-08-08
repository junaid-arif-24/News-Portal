import React from 'react';
import { Skeleton } from '@mui/material';
import { Paper } from '@mui/material';

export const NewsListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from(new Array(8)).map((_, index) => (
        <div key={index} className="bg-white rounded-md shadow-md flex flex-col gap-1">
          <Skeleton variant="rectangular" width="100%" height={160} className="mb-1" />
          <div className="p-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="100%" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TrendingNewsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from(new Array(4)).map((_, index) => (
        <div key={index} className="bg-white rounded-md shadow-md flex flex-col gap-1">
          <Skeleton variant="rectangular" width="100%" height={160} className="mb-1" />
          <div className="p-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="100%" />
          </div>
        </div>
      ))}
    </div>
  );
};
export const SingleNewsSkeleton: React.FC = () => {
  return (
    <div className="p-4">
      <Skeleton variant="text" width="40%" height={40} />
      <Skeleton variant="rectangular" width="100%" height={200} className="my-4" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="95%" />
    </div>
  );
};


export const LatestNewsSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-100 p-5 py-2 mb-5">
      <h1 className="text-lg font-bold mb-1 underline">Latest News</h1>
      <div className="mx-auto">
        <div className="md:flex md:max-h-[calc(100vh-30px)]">
          {/* Main Featured News Slider Skeleton */}
          <div className="md:w-2/3 p-4">
            <Paper className="bg-white md:h-[calc(100vh-30px)] p-0 rounded-lg shadow-md">
              <Skeleton variant="rectangular" width="100%" height={384} className="mb-2 rounded-lg" />
              <div className="p-4">
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="90%" height={20} />
              </div>
            </Paper>
          </div>

          {/* Side News Skeleton */}
          <div className="w-full md:w-1/3 p-4 space-y-4 max-h-full overflow-y-auto">
            {Array.from(new Array(4)).map((_, index) => (
              <div key={index} className="bg-white p-1 rounded-lg shadow-md flex h-36">
                <Skeleton variant="rectangular" width="33%" height="100%" className="rounded-l-lg" />
                <div className="p-2 flex flex-col justify-between w-2/3">
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="90%" height={20} />
                </div>
              </div>
            ))}
            <div className="bg-white p-4 rounded-lg shadow-md flex justify-center items-center">
              <Skeleton variant="text" width="50%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};