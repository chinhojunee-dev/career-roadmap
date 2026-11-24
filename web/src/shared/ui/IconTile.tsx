import type { CSSProperties } from 'react';
import { Icon } from './Svg';

export function IconTile({ d, style }: { d: string | string[]; style?: CSSProperties }) {
  return <span className="cr-ico" style={style}><Icon d={d} /></span>;
}
export const FLAG = ['M3.5 16V2.5', 'M3.5 3h10l-2 3 2 3h-10'];
