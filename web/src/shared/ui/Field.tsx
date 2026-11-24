import type { CSSProperties, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

/** 라벨 + 입력 묶음 (cr-field). label 요소로 감싸 입력과 연결된다 */
export function Field({ label, children, as: Tag = 'label', style }: { label: ReactNode; children: ReactNode; as?: 'label' | 'div'; style?: CSSProperties }) {
  return <Tag className="cr-field" style={style}><span>{label}</span>{children}</Tag>;
}
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="cr-input" {...props} />;
}
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="cr-input" {...props} />;
}
