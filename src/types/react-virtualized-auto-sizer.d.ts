declare module 'react-virtualized-auto-sizer' {
  import { ComponentType, CSSProperties, ReactNode } from 'react';

  interface AutoSizerProps {
    children: (size: { width: number; height: number }) => ReactNode;
    className?: string;
    defaultHeight?: number;
    defaultWidth?: number;
    disableHeight?: boolean;
    disableWidth?: boolean;
    style?: CSSProperties;
    onResize?: (size: { height: number; width: number }) => void;
  }

  const AutoSizer: ComponentType<AutoSizerProps>;
  export default AutoSizer;
}