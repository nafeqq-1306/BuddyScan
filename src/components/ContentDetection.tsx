import React, { useState, useCallback, ChangeEvent } from 'react';

interface Props {
  mode: 'text' | 'image' | 'video';
  onSubmit: (content: { text?: string; files?: File[] }) => void;
}

const fileSizeLimits = {
  image: 10 * 1024 * 1024, // 10 MB
  video: 100 * 1024 * 1024, // 100 MB
  audio: 50 * 1024 * 1024, // 50 MB for audio files within video mode
};

const ContentDetection: React.FC<Props> = ({ mode, onSubmit }) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptedTypes = {
    text: '.txt',
    image: '.jpg,.jpeg,.png',
    video: '.mp4,.mp3,.wav'
  };

  const validateFiles = (newFiles: File[]): string | null => {
    for (const file of newFiles) {
      if (mode === 'image') {
        if (file.size > fileSizeLimits.image) {
          return `Image ${file.name} exceeds the 10 MB limit`;
        }
      } else if (mode === 'video') {
        // Check if it's an audio file
        if (file.type.startsWith('audio/')) {
          if (file.size > fileSizeLimits.audio) {
            return `Audio ${file.name} exceeds the 50 MB limit`;
          }
        } else {
          if (file.size > fileSizeLimits.video) {
            return `Video ${file.name} exceeds the 100 MB limit`;
          }
        }
      }
    }
    return null;
  };

  // Clear state when mode changes
  React.useEffect(() => {
    setText("");
    setFiles([]);
    setError(null);
    setIsDragging(false);
  }, [mode]);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (e.target.value.length > 0) {
      setFiles([]);
      setError(null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validationError = validateFiles(selectedFiles);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    setText("");
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    if (files.length === 1) {
      setError(null);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (mode !== 'text') setIsDragging(true);
  }, [mode]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (mode !== 'text') {
      const droppedFiles = Array.from(e.dataTransfer.files || []);
      const validationError = validateFiles(droppedFiles);
      
      if (validationError) {
        setError(validationError);
        return;
      }

      setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
      setText("");
      setError(null);
    }
  }, [mode]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleSubmit = () => {
    if (text) {
      onSubmit({ text });
    } else if (files.length > 0) {
      onSubmit({ files });
    }
  };

  return (
    <div 
      className={`bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 w-full
        ${isDragging ? 'ring-2 ring-emerald-500' : 'ring-1 ring-gray-100'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {mode === 'text' ? (
        /* Text Input */
        <textarea
          className="w-full h-[280px] p-5 border border-gray-100 rounded-lg resize-none 
            focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            text-gray-700 text-base bg-white/90 placeholder-gray-400
            disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
          placeholder="Enter your text here to check for AI-generated content..."
          value={text}
          onChange={handleTextChange}
        />
      ) : (
        /* File Upload Area */
        <div className="h-[280px] flex flex-col">
          <input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={handleFileChange}
            accept={acceptedTypes[mode]}
            multiple
          />
          
          <div className="flex-1 overflow-auto">
            {files.length === 0 ? (
              <label
                htmlFor="file-upload"
                className={`w-full h-full group flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl 
                  transition-all duration-300 ease-in-out bg-white/50 border-gray-300 
                  hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer
                  ${isDragging ? 'border-emerald-400 bg-emerald-50/50' : ''}`}
              >
                <div className="w-14 h-14 mb-3 rounded-full flex items-center justify-center
                  transition-all duration-300 group-hover:scale-110
                  bg-gradient-to-br from-blue-500/10 to-emerald-500/10 text-emerald-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-base font-medium mb-1 text-gray-700">
                    {mode === 'image' ? 'Drop your images here' : 'Drop your files here'}
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {mode === 'image' 
                      ? 'Supported formats: .jpg, .png (max 10MB each)' 
                      : 'Supported formats: .mp4 (max 100MB), .mp3, .wav (max 50MB)'}
                  </p>
                </div>
              </label>
            ) : (
              <div className="space-y-2 p-2">
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between p-4 bg-white/80 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        {file.type.includes('image') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ) : file.type.includes('audio') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-700 text-sm font-medium truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {(file.size / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {/* Add More Button */}
                <label
                  htmlFor="file-upload"
                  className="block w-full p-4 text-center text-emerald-600 hover:text-emerald-700
                    border-2 border-dashed border-emerald-200 rounded-lg cursor-pointer
                    hover:bg-emerald-50/50 transition-colors"
                >
                  + Add More Files
                </label>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-2 text-red-500 text-sm bg-red-50 rounded-lg p-2">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex items-center justify-end gap-3">
        {/* Only show Clear All when there's content to clear */}
        {(text || files.length > 0) && (
          <button
            onClick={() => {
              setText("");
              setFiles([]);
              setError(null);
            }}
            className="px-4 py-2.5 rounded-lg text-gray-600 font-medium text-sm
              transition-all border border-gray-200 hover:border-gray-300
              bg-white hover:bg-gray-50 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </button>
        )}
        <button
          onClick={handleSubmit}
          className={`px-6 py-2.5 rounded-lg text-white font-medium text-sm
            transition-all shadow-sm hover:shadow-md
            ${(text || files.length > 0) 
              ? 'bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600' 
              : 'bg-gray-300 cursor-not-allowed'}`}
          disabled={!text && files.length === 0}
        >
          Check for AI Content
        </button>
      </div>
    </div>
  );
};

const DetectionResult = () => {
  return <div>Detection Result</div>;
};

export default ContentDetection;
export {};