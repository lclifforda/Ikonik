import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTRPC } from "~/trpc/react";
import { RealEstateForm } from "~/components/RealEstateForm";
import { AdviceDisplay } from "~/components/AdviceDisplay";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [advice, setAdvice] = useState<string | null>(null);
  const trpc = useTRPC();

  const generateAdviceMutation = useMutation(
    trpc.generateRealEstateAdvice.mutationOptions({
      onSuccess: (data) => {
        setAdvice(data.advice);
        toast.success("Investment advice generated successfully!");
      },
      onError: (error) => {
        toast.error("Failed to generate advice. Please try again.");
        console.error("Error generating advice:", error);
      },
    })
  );

  const handleFormSubmit = async (formData: any) => {
    try {
      await generateAdviceMutation.mutateAsync(formData);
    } catch (error) {
      // Error handling is done in the mutation options
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Spanish Real Estate Investment Advisor</h1>
          <p className="mt-2 text-lg text-gray-600">
            Get strategic advice for international property investment in Spain
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">Welcome to Your Investment Advisor</h2>
          <p className="text-blue-800">
            Our AI-powered advisor provides personalized guidance for international investors looking to invest in Spanish real estate. 
            Get insights on market trends, potential returns, legal considerations, and fiscal implications tailored to your investment profile.
          </p>
          <div className="mt-4 text-sm text-blue-700">
            <p><strong>Note:</strong> This advice is for informational purposes only and does not constitute formal financial or legal advice. 
            Always consult with qualified professionals before making investment decisions.</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell Us About Your Investment Goals</h2>
          <RealEstateForm 
            onSubmit={handleFormSubmit} 
            isLoading={generateAdviceMutation.isPending}
          />
        </div>

        {/* Advice Display */}
        {advice && <AdviceDisplay advice={advice} />}

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Market Analysis</h3>
            <p className="text-gray-600">Current trends and opportunities in Spanish real estate markets across different regions.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Guidance</h3>
            <p className="text-gray-600">Essential legal requirements and considerations for international property investors.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tax Implications</h3>
            <p className="text-gray-600">Overview of fiscal considerations and tax obligations for foreign property ownership.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
