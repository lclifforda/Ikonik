import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AcademicCapIcon, ArrowTrendingUpIcon, MapIcon } from "@heroicons/react/24/outline";
import { useTRPC } from "~/trpc/react";
import { RealEstateForm } from "~/components/RealEstateForm";
import { AdviceDisplay } from "~/components/AdviceDisplay";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const trpc = useTRPC();

  // Helper function to get user agent
  const getUserAgent = () => {
    return typeof navigator !== 'undefined' ? navigator.userAgent : undefined;
  };

  // Helper function to get approximate IP (client-side can't get real IP, but we can use a placeholder)
  const getClientInfo = () => {
    return {
      sessionId,
      userAgent: getUserAgent(),
      ipAddress: undefined, // Client-side can't access real IP, server would need to determine this
    };
  };

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
      const clientInfo = getClientInfo();
      await generateAdviceMutation.mutateAsync({
        ...formData,
        ...clientInfo,
      });
    } catch (error) {
      // Error handling is done in the mutation options
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Personalized Spanish Real Estate Advisor
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl">
            Get comprehensive property investment advice with detailed insights on education options,
            property appreciation potential, and local amenities across Spanish regions
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 mb-12 border border-blue-100 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Comprehensive Investment Advisor</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Our AI-powered advisor provides in-depth analysis across all aspects of Spanish real estate investment.
                  Whether you're an investor, expatriate, digital nomad, or family with children, get personalized insights that go beyond basic property advice.
                </p>
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="font-semibold text-gray-900 mb-2">Enhanced Capabilities:</p>
                  <p>
                    Compare multiple Spanish regions with detailed analysis of education systems,
                    property appreciation potential, local amenities, market trends, legal considerations, and practical implementation steps.
                  </p>
                </div>
                <p>
                  Select multiple locations to receive side-by-side comparisons, helping you make informed decisions based on
                  comprehensive data about schools, healthcare, transportation, cultural amenities, and investment potential.
                </p>
              </div>
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-amber-800">Important Disclaimer</p>
                    <p className="text-sm text-amber-700 mt-1">
                      This advice is for informational purposes only and does not constitute formal financial or legal advice.
                      Always consult with qualified professionals before making investment decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Tell Us About Your Profile and Goals</h2>
          </div>
          <RealEstateForm
            onSubmit={handleFormSubmit}
            isLoading={generateAdviceMutation.isPending}
          />
        </div>

        {/* Advice Display */}
        {advice && <AdviceDisplay advice={advice} />}

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Education & Amenities Analysis</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Comprehensive insights on school systems, healthcare, transportation, cultural amenities, and lifestyle factors across different Spanish regions.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Property Appreciation Intelligence</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Detailed market analysis including growth drivers, historical trends, infrastructure development impact, and future appreciation potential for informed investment decisions.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MapIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Multi-Region Comparison</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Compare multiple Spanish locations side-by-side across education options, investment potential, amenities, and lifestyle factors to find your perfect match.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
