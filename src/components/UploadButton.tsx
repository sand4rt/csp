import type { ChangeEvent, InputHTMLAttributes } from 'react';

type FileInputProps = {
  onFileSelect(file: File): void;
} & InputHTMLAttributes<HTMLInputElement>;

export function UploadButton({
  onFileSelect,
  className = '',
  ...props
}: FileInputProps) {
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    const file = Array.from(files ?? [])[0];
    onFileSelect(file);
    event.target.value = '';
  }

  return (
    <label
      className={`
        bg-primary flex h-12 cursor-pointer items-center justify-center rounded text-lg 
        font-medium text-white transition duration-150 ease-in-out
        ${className} ${props.disabled ? 'bg-gray-600' : ''}
      `}
    >
      Upload Records
      <input className="sr-only" type="file" onChange={onChange} {...props} />
    </label>
  );
}
