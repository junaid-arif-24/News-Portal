import * as React from 'react';

interface Icons {
  [key: string]: React.ReactElement;
}

export const icons: Icons = {
  Business: React.createElement('svg', { className: 'h-6 w-6 text-yellow-500', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M3 12h18M3 6h18M3 18h18' })
  ),
  Travel: React.createElement('svg', { className: 'h-6 w-6 text-purple-500', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M12 4V2M12 22v-2M22 12h-2M4 12H2M15 15l3 3m-3-3l-3 3' })
  ),
  Tech: React.createElement('svg', { className: 'h-6 w-6 text-blue-500', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M6 2l6 6-6 6-6-6 6-6zM18 2l6 6-6 6-6-6 6-6z' })
  ),
  Hollywood: React.createElement('svg', { className: 'h-6 w-6 text-pink-500', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M12 4v8l4 4' })
  ),
  Sports: React.createElement('svg', { className: 'h-6 w-6 text-green-500', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M3 13h2V9H3v4zM3 17h2v-4H3v4zM19 13h2V9h-2v4zM19 17h2v-4h-2v4z' })
  ),
};
