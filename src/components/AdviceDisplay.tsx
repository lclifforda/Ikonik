import Markdown from "markdown-to-jsx";

interface AdviceDisplayProps {
  advice: string;
}

export function AdviceDisplay({ advice }: AdviceDisplayProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mt-12 border border-gray-100">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Your Personalized Investment Advice</h2>
      </div>
      
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-6 mb-8 border-2 border-emerald-100">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-emerald-900 mb-1">
              AI-Powered Personalized Analysis
            </p>
            <p className="text-emerald-800">
              This comprehensive advice has been tailored specifically for your profile, preferences, and investment goals
            </p>
          </div>
        </div>
      </div>
      
      <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-strong:font-semibold prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:my-1 prose-a:text-blue-600 prose-a:font-medium hover:prose-a:text-blue-800">
        <Markdown>{advice}</Markdown>
      </article>
    </div>
  );
}
