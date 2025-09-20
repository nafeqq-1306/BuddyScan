import React from 'react';
import ContentDetection from './components/ContentDetection';
import ResultPage from './components/ResultPage';
import buddyScanLogo from '/BuddyScan.png';

type DetectionMode = 'text' | 'image' | 'video';

export default function App() {
  const [detectionMode, setDetectionMode] = React.useState<DetectionMode>('text');
  const [analysisResult, setAnalysisResult] = React.useState<{
    mode: DetectionMode;
    content: { text?: string; files?: File[] };
  } | null>(null);

  const handleSubmit = (content: { text?: string; files?: File[] }) => {
    // Set the result to show the result page
    setAnalysisResult({
      mode: detectionMode,
      content
    });
  };

  const handleBack = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 to-emerald-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-sm shadow-lg py-6 w-full">
        <div className="w-full max-w-[1920px] min-w-[1024px] mx-auto px-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-emerald-400/10 to-blue-500/5 blur-2xl"></div>
            <div className="relative flex items-center gap-6 bg-gradient-to-r from-white/50 to-transparent p-4 rounded-2xl">
              <div className="flex items-center gap-6 group">
                <img src={buddyScanLogo} alt="BuddyScan Logo" 
                  className="h-16 w-auto transform transition-all duration-300 group-hover:scale-110 drop-shadow-xl" />
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent
                    drop-shadow-sm transform transition-all duration-300 group-hover:scale-105">
                    BuddyScan
                  </h1>
                  <p className="mt-2 text-xl text-gray-600 transition-all duration-300 group-hover:text-gray-800">
                    Your trusted AI content detection companion
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600 mb-6 bg-white/50 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
              Select your preferred detection method below
            </p>
          </div>

          {/* Feature Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center px-6">
            <button
              onClick={() => setDetectionMode('text')}
              className={`p-6 rounded-xl backdrop-blur-sm shadow-sm hover:shadow-xl 
                transform transition-all duration-300 ease-in-out hover:scale-105 text-left
                border cursor-pointer group
                ${detectionMode === 'text' 
                  ? 'bg-gradient-to-br from-white via-blue-50 to-emerald-50 border-blue-200 shadow-lg' 
                  : 'bg-gradient-to-br from-white via-blue-50/50 to-emerald-50/50 border-gray-200 hover:border-blue-200'}`}
            >
              <div className="text-2xl mb-3 text-blue-700 font-semibold
                group-hover:scale-105 transition-transform duration-300">
                Text Analysis
              </div>
              <p className="text-gray-700 group-hover:text-gray-900">Advanced detection of AI-generated text content, articles, and documents with high accuracy</p>
            </button>
            <button
              onClick={() => setDetectionMode('image')}
              className={`p-6 rounded-xl backdrop-blur-sm shadow-sm hover:shadow-xl 
                transform transition-all duration-300 ease-in-out hover:scale-105 text-left
                border cursor-pointer group
                ${detectionMode === 'image' 
                  ? 'bg-gradient-to-br from-white via-emerald-50 to-blue-50 border-emerald-200 shadow-lg' 
                  : 'bg-gradient-to-br from-white via-emerald-50/50 to-blue-50/50 border-gray-200 hover:border-emerald-200'}`}
            >
              <div className="text-2xl mb-3 text-emerald-700 font-semibold
                group-hover:scale-105 transition-transform duration-300">
                Image Detection
              </div>
              <p className="text-gray-700 group-hover:text-gray-900">Identify AI-generated and manipulated images using state-of-the-art visual analysis</p>
            </button>
            <button
              onClick={() => setDetectionMode('video')}
              className={`p-6 rounded-xl backdrop-blur-sm shadow-sm hover:shadow-xl 
                transform transition-all duration-300 ease-in-out hover:scale-105 text-left
                border cursor-pointer group
                ${detectionMode === 'video' 
                  ? 'bg-gradient-to-br from-white via-blue-50 to-emerald-50 border-blue-200 shadow-lg' 
                  : 'bg-gradient-to-br from-white via-blue-50/50 to-emerald-50/50 border-gray-200 hover:border-emerald-200'}`}
            >
              <div className="text-2xl mb-3 text-blue-700 font-semibold
                group-hover:scale-105 transition-transform duration-300">
                Video Verification
              </div>
              <p className="text-gray-700 group-hover:text-gray-900">Detect synthetic videos, deepfakes, and AI-modified video content in real-time</p>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 flex items-start w-full">
        <div className="w-full max-w-[1920px] min-w-[1024px] mx-auto px-8">
          <div className="w-full max-w-6xl mx-auto">
            {analysisResult ? (
              <ResultPage 
                mode={analysisResult.mode}
                content={analysisResult.content}
                onBack={handleBack}
              />
            ) : (
              <>
                <ContentDetection mode={detectionMode} onSubmit={handleSubmit} />

                {/* Supported Formats */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 bg-white/50 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
                    {detectionMode === 'text' && 'Supported formats: Plain text or text files (.txt)'}
                    {detectionMode === 'image' && 'Supported formats: Images (.jpg, .png)'}
                    {detectionMode === 'video' && 'Supported formats: Video (.mp4) and Audio (.mp3, .wav)'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}