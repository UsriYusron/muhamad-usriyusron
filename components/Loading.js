// components/LoadingWithText.jsx
export default function LoadingWithText() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
      
      {/* Text with dots animation */}
      <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">
        Loading
        <span className="animate-pulse">.</span>
        <span className="animate-pulse animation-delay-200">.</span>
        <span className="animate-pulse animation-delay-400">.</span>
      </div>
      <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">
        for the best experience use a laptop device
      </div>
    </div>
  );
}