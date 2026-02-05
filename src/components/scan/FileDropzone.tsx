import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';

interface FileDropzoneProps {
  uploadedFiles: Array<{ name: string; content: string }>;
  onDrop: (acceptedFiles: File[]) => void;
}

export default function FileDropzone({ uploadedFiles, onDrop }: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/*': ['.sol', '.rs', '.vy', '.move', '.toml', '.json'] },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActive
          ? 'border-accent bg-accent/10 scale-[1.02]'
          : 'border-border hover:border-muted-foreground/50 hover:bg-muted/20'
        }`}
    >
      <input {...getInputProps()} />
      {uploadedFiles.length > 0 ? (
        <div className="text-center text-foreground">
          <FileText className="w-10 h-10 mb-2 mx-auto text-accent" />
          <div className="font-bold">{uploadedFiles.length} files ready</div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <Upload className="w-10 h-10 mb-2 mx-auto opacity-50" />
          <p className="font-medium">Drop Solana programs here</p>
          <p className="text-xs mt-1 opacity-60">.rs, .py, .move, .sol</p>
        </div>
      )}
    </div>
  );
}
