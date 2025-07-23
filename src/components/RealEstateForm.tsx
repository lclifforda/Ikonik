import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  investmentType: z.enum(["residential", "commercial", "vacation_rental", "mixed"]),
  budget: z.enum(["under_200k", "200k_500k", "500k_1m", "1m_2m", "over_2m"]),
  location: z.enum(["madrid", "barcelona", "valencia", "seville", "malaga", "coastal", "other"]),
  experience: z.enum(["beginner", "intermediate", "experienced"]),
  timeline: z.enum(["immediate", "6_months", "1_year", "2_years_plus"]),
  specificQuestions: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RealEstateFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export function RealEstateForm({ onSubmit, isLoading }: RealEstateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Investment Type */}
        <div>
          <label htmlFor="investmentType" className="block text-sm font-medium text-gray-700 mb-2">
            Investment Type
          </label>
          <select
            id="investmentType"
            {...register("investmentType")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select investment type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="vacation_rental">Vacation Rental</option>
            <option value="mixed">Mixed Use</option>
          </select>
          {errors.investmentType && (
            <p className="mt-1 text-sm text-red-600">{errors.investmentType.message}</p>
          )}
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Budget Range
          </label>
          <select
            id="budget"
            {...register("budget")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select budget range</option>
            <option value="under_200k">Under €200,000</option>
            <option value="200k_500k">€200,000 - €500,000</option>
            <option value="500k_1m">€500,000 - €1,000,000</option>
            <option value="1m_2m">€1,000,000 - €2,000,000</option>
            <option value="over_2m">Over €2,000,000</option>
          </select>
          {errors.budget && (
            <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Location
          </label>
          <select
            id="location"
            {...register("location")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select location</option>
            <option value="madrid">Madrid</option>
            <option value="barcelona">Barcelona</option>
            <option value="valencia">Valencia</option>
            <option value="seville">Seville</option>
            <option value="malaga">Málaga</option>
            <option value="coastal">Spanish Coastal Areas</option>
            <option value="other">Other Spanish Regions</option>
          </select>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            id="experience"
            {...register("experience")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select experience level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="experienced">Experienced</option>
          </select>
          {errors.experience && (
            <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
          )}
        </div>

        {/* Timeline */}
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
            Investment Timeline
          </label>
          <select
            id="timeline"
            {...register("timeline")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select timeline</option>
            <option value="immediate">Immediate (0-3 months)</option>
            <option value="6_months">6 months</option>
            <option value="1_year">1 year</option>
            <option value="2_years_plus">2+ years</option>
          </select>
          {errors.timeline && (
            <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
          )}
        </div>
      </div>

      {/* Specific Questions */}
      <div>
        <label htmlFor="specificQuestions" className="block text-sm font-medium text-gray-700 mb-2">
          Specific Questions or Requirements (Optional)
        </label>
        <textarea
          id="specificQuestions"
          {...register("specificQuestions")}
          rows={4}
          placeholder="Any specific questions about Spanish real estate investment, legal requirements, or market conditions..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.specificQuestions && (
          <p className="mt-1 text-sm text-red-600">{errors.specificQuestions.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Generating Advice..." : "Get Investment Advice"}
      </button>
    </form>
  );
}
