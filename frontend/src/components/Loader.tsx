// src/components/Loader.tsx
import React, { CSSProperties } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
//   borderColor: 'red',
};

interface LoaderProps {
  loading: boolean;
  color?: string;
  size?: number;
}

const Loader: React.FC<LoaderProps> = ({ loading, color = '#3498db', size = 100 }) => {
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
