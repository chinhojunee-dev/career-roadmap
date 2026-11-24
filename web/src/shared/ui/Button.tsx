import Link from 'next/link';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type Props = {
  variant?: 'primary' | 'outline';
  href?: string;
  style?: CSSProperties;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'>;

/** 시안의 btn btn-jitter(주 버튼) / btn-jitter-outline(보조 버튼). href 가 있으면 링크로 렌더 */
export function Button({ variant = 'primary', href, style, children, ...rest }: Props) {
  const cls = variant === 'primary' ? 'btn btn-jitter' : 'btn btn-jitter-outline';
  if (href) return <Link className={cls} href={href} style={style}>{children}</Link>;
  return <button type="button" className={cls} style={style} {...rest}>{children}</button>;
}
