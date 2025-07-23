import Markdown from "markdown-to-jsx";

interface AdviceDisplayProps {
  advice: string;
}

export function AdviceDisplay({ advice }: AdviceDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Investment Advice</h2>
      <article className="prose prose-lg max-w-none">
        <Markdown>{advice}</Markdown>
      </article>
    </div>
  );
}
