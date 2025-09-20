import React from 'react';

interface ResultPageProps {
  mode: 'text' | 'image' | 'video';
  content: {
    text?: string;
    files?: File[];
  };
  onBack: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ mode, content, onBack }) => {
  // Mock results based on mode and content
  const getMockResult = () => {
    if (content.text) {
      return {
        result: "AI-Generated Content Detected",
        confidence: "87%",
        details: "This text shows characteristics commonly associated with AI-generated content, including repetitive patterns and specific language structures."
      };
    } else if (content.files) {
      const fileResults = content.files.map(file => ({
        name: file.name,
        result: Math.random() > 0.5 ? "AI-Generated" : "Likely Human-Created",
        confidence: `${Math.floor(Math.random() * 30 + 70)}%`,
      }));
      return {
        fileResults,
        summary: `Analyzed ${fileResults.length} ${mode}${fileResults.length > 1 ? 's' : ''}`
      };
    }
    return null;
  };

  const result = getMockResult();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Analysis Results</h2>
        <div className="relative group">
          {/* Pulsing animation behind the button */}
          <div className="absolute inset-0 rounded-lg bg-emerald-200/50 animate-pulse group-hover:bg-blue-200/50"></div>
          
          <button
            onClick={onBack}
            className="relative px-4 py-2 flex items-center gap-2 rounded-lg font-medium
              text-emerald-600 hover:text-blue-600
              bg-white hover:bg-white
              border-2 border-emerald-200 hover:border-blue-200
              shadow-sm hover:shadow-md
              transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
            Back to Input
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Mode Indicator */}
        <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          {mode.charAt(0).toUpperCase() + mode.slice(1)} Analysis
        </div>

        {/* Results */}
        {content.text ? (
          <div className="space-y-4">
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-lg text-gray-800">{result?.result}</div>
                <div className="text-emerald-600 font-semibold">{result?.confidence}</div>
              </div>
              <p className="text-gray-600">{result?.details}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
              <div className="font-medium text-gray-700 mb-2">Analyzed Text:</div>
              <div className="text-gray-600 whitespace-pre-wrap">
                {content.text.length > 300 
                  ? content.text.slice(0, 300) + "..."
                  : content.text
                }
              </div>
            </div>
          </div>
        ) : content.files ? (
          <div className="space-y-4">
            <div className="text-gray-600 mb-2">{result?.summary}</div>
            {result?.fileResults?.map((fileResult, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-800">{fileResult.name}</div>
                  <div className="text-emerald-600 font-semibold">{fileResult.confidence}</div>
                </div>
                <div className="text-gray-600">{fileResult.result}</div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Navigation Help */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-500 bg-gray-50/80 px-6 py-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Click the <span className="text-emerald-600 font-medium">Back</span> button to analyze another {mode === 'text' ? 'text' : mode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;