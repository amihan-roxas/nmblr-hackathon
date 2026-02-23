import { useRef } from 'react';
import { readFileAsDataUrl } from '../../lib/utils.ts';

interface Props {
  preview: string | null;
  onSelect: (file: File, dataUrl: string) => void;
}

export default function PhotoUpload({ preview, onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    onSelect(file, dataUrl);
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">Photo</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-emerald-400"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-gray-400">Click to upload photo</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
