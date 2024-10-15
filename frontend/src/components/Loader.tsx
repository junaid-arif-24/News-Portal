// src/components/Loader.tsx
import React, { CSSProperties } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { LoaderProps } from '../types/DataProvider';



const Loader: React.FC<LoaderProps> = ({ loading, color = '#3498db', size = 100, center = false }) => {
  // Conditionally apply margin only when center is true
  const override: CSSProperties = center
    ? { display: 'block', margin: '0 auto' }
    : { display: 'block' };

  return (
    <ClipLoader
      color={color}
      loading={loading}
      cssOverride={override}
      size={size}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Loader;
