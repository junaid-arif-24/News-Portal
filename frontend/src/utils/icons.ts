import * as React from 'react';
import { Icons, IconsProps } from '../types/DataProvider';


export const icons: Icons = {
  Business: ({ size = 'h-6 w-6' }: IconsProps) =>
    React.createElement('svg', { className: `${size} text-yellow-500`, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M3 12h18M3 6h18M3 18h18' })
    ),
  Travel: ({ size = 'h-6 w-6' }: IconsProps) =>
    React.createElement('svg', { className: `${size} text-purple-500`, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M12 4V2M12 22v-2M22 12h-2M4 12H2M15 15l3 3m-3-3l-3 3' })
    ),
  Tech: ({ size = 'h-6 w-6' }: IconsProps) =>
    React.createElement('svg', { className: `${size} text-blue-500`, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M3 4v16h18V4H3zm2 2h14v12H5V6zm9 10h3v-2h-3v2zm-2-2v-2H8v2h4z' })
    ),
  Hollywood: ({ size = 'h-6 w-6' }: IconsProps) =>
    React.createElement('svg', { className: `${size} text-pink-500`, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M12 4v8l4 4' })
    ),
  Sports: ({ size = 'h-6 w-6' }: IconsProps) =>
    React.createElement('svg', { className: `${size} text-green-500`, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M3 13h2V9H3v4zM3 17h2v-4H3v4zM19 13h2V9h-2v4zM19 17h2v-4h-2v4z' })
    ),
  Health: ({ size = 'h-6 w-6' }: IconsProps) =>
    React.createElement('svg', { className: `${size} text-red-500`, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M12 2l2 7h7l-5 4 2 7-7-5-7 5 2-7-5-4h7z' })
    ),
  Default: ({ size = 'h-6 w-6' }: IconsProps) =>
    React.createElement('svg', { className: `${size} text-gray-500`, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M3 18v-6a9 9 0 0118 0v6' }),
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M3 13h18' })
    ),
};
