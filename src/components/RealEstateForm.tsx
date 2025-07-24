import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProfileHints } from "~/components/ProfileHints";

const formSchema = z.object({
  userProfile: z.enum(["investor", "expatriate", "digital_nomad", "family"]),
  investmentType: z.enum(["residential", "commercial", "vacation_rental", "mixed"]),
  budget: z.enum(["under_200k", "200k_500k", "500k_1m", "1m_2m", "over_2m"]),
  locations: z.array(z.enum(["madrid", "barcelona", "valencia", "seville", "malaga", "bilbao", "granada", "alicante", "coastal", "other"])).min(1, "Please select at least one location"),
  experience: z.enum(["beginner", "intermediate", "experienced"]),
  timeline: z.enum(["immediate", "6_months", "1_year", "2_years_plus"]),
  specificNeeds: z.array(z.string()).optional(),
  livingPreferences: z.object({
    proximity_to_schools: z.boolean().optional(),
    proximity_to_transport: z.boolean().optional(),
    proximity_to_amenities: z.boolean().optional(),
    quiet_neighborhood: z.boolean().optional(),
    expat_community: z.boolean().optional(),
    work_from_home_space: z.boolean().optional(),
    short_term_rental_friendly: z.boolean().optional(),
    investment_potential: z.boolean().optional(),
  }).optional(),
  educationPreferences: z.object({
    school_types: z.array(z.enum(["public", "private", "international", "bilingual", "montessori", "waldorf"])).optional(),
    language_preferences: z.array(z.enum(["spanish", "english", "french", "german", "other"])).optional(),
    education_level_needed: z.array(z.enum(["preschool", "primary", "secondary", "university", "adult_education"])).optional(),
    proximity_importance: z.enum(["not_important", "somewhat_important", "very_important", "essential"]).optional(),
  }).optional(),
  propertyAppreciationPreferences: z.object({
    growth_expectations: z.enum(["conservative", "moderate", "aggressive", "no_preference"]).optional(),
    market_factors: z.array(z.enum(["tourism_growth", "infrastructure_development", "tech_sector_growth", "population_growth", "gentrification", "coastal_premium", "historical_significance"])).optional(),
    investment_horizon: z.enum(["short_term", "medium_term", "long_term", "flexible"]).optional(),
    risk_tolerance: z.enum(["low", "moderate", "high"]).optional(),
  }).optional(),
  amenitiesPreferences: z.object({
    essential_amenities: z.array(z.enum(["hospitals", "shopping_centers", "restaurants", "gyms", "parks", "beaches", "museums", "theaters", "libraries", "banks"])).optional(),
    lifestyle_amenities: z.array(z.enum(["golf_courses", "marinas", "ski_resorts", "hiking_trails", "cycling_paths", "nightlife", "farmers_markets", "art_galleries", "music_venues", "sports_facilities"])).optional(),
    proximity_importance: z.enum(["walking_distance", "short_drive", "reasonable_distance", "not_important"]).optional(),
  }).optional(),
  compareAreas: z.boolean().optional(),
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
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const selectedProfile = watch("userProfile");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* User Profile Section */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <label className="text-lg font-semibold text-gray-900">
            What best describes you?
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="group relative flex items-center space-x-3 cursor-pointer bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-200">
            <input
              type="radio"
              value="investor"
              {...register("userProfile")}
              className="sr-only"
            />
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-has-[:checked]:border-blue-500 group-has-[:checked]:bg-blue-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity"></div>
            </div>
            <span className="font-medium text-gray-900">Investor</span>
          </label>
          <label className="group relative flex items-center space-x-3 cursor-pointer bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-200">
            <input
              type="radio"
              value="expatriate"
              {...register("userProfile")}
              className="sr-only"
            />
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-has-[:checked]:border-blue-500 group-has-[:checked]:bg-blue-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity"></div>
            </div>
            <span className="font-medium text-gray-900">Expatriate</span>
          </label>
          <label className="group relative flex items-center space-x-3 cursor-pointer bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-200">
            <input
              type="radio"
              value="digital_nomad"
              {...register("userProfile")}
              className="sr-only"
            />
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-has-[:checked]:border-blue-500 group-has-[:checked]:bg-blue-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity"></div>
            </div>
            <span className="font-medium text-gray-900">Digital Nomad</span>
          </label>
          <label className="group relative flex items-center space-x-3 cursor-pointer bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-200">
            <input
              type="radio"
              value="family"
              {...register("userProfile")}
              className="sr-only"
            />
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-has-[:checked]:border-blue-500 group-has-[:checked]:bg-blue-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity"></div>
            </div>
            <span className="font-medium text-gray-900">Family with Children</span>
          </label>
        </div>
        {errors.userProfile && (
          <p className="mt-3 text-sm text-red-600 flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.userProfile.message}</span>
          </p>
        )}
        <ProfileHints selectedProfile={selectedProfile} />
      </div>

      {/* Basic Information Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Investment Type */}
          <div className="space-y-2">
            <label htmlFor="investmentType" className="block text-sm font-medium text-gray-700">
              Investment Type
            </label>
            <select
              id="investmentType"
              {...register("investmentType")}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select investment type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="vacation_rental">Vacation Rental</option>
              <option value="mixed">Mixed Use</option>
            </select>
            {errors.investmentType && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.investmentType.message}</span>
              </p>
            )}
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Budget Range
            </label>
            <select
              id="budget"
              {...register("budget")}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select budget range</option>
              <option value="under_200k">Under €200,000</option>
              <option value="200k_500k">€200,000 - €500,000</option>
              <option value="500k_1m">€500,000 - €1,000,000</option>
              <option value="1m_2m">€1,000,000 - €2,000,000</option>
              <option value="over_2m">Over €2,000,000</option>
            </select>
            {errors.budget && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.budget.message}</span>
              </p>
            )}
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Experience Level
            </label>
            <select
              id="experience"
              {...register("experience")}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select experience level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="experienced">Experienced</option>
            </select>
            {errors.experience && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.experience.message}</span>
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
              Investment Timeline
            </label>
            <select
              id="timeline"
              {...register("timeline")}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select timeline</option>
              <option value="immediate">Immediate (0-3 months)</option>
              <option value="6_months">6 months</option>
              <option value="1_year">1 year</option>
              <option value="2_years_plus">2+ years</option>
            </select>
            {errors.timeline && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.timeline.message}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <label className="text-lg font-semibold text-gray-900">
            Preferred Locations (Select one or more to compare)
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { value: "madrid", label: "Madrid" },
            { value: "barcelona", label: "Barcelona" },
            { value: "valencia", label: "Valencia" },
            { value: "seville", label: "Seville" },
            { value: "malaga", label: "Málaga" },
            { value: "bilbao", label: "Bilbao" },
            { value: "granada", label: "Granada" },
            { value: "alicante", label: "Alicante" },
            { value: "coastal", label: "Coastal Areas" },
            { value: "other", label: "Other Regions" }
          ].map((location) => (
            <label key={location.value} className="group relative flex items-center space-x-3 cursor-pointer bg-gray-50 rounded-xl p-3 border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 has-[:checked]:border-green-500 has-[:checked]:bg-green-50 has-[:checked]:ring-2 has-[:checked]:ring-green-200">
              <input
                type="checkbox"
                value={location.value}
                {...register("locations")}
                className="sr-only"
              />
              <div className="w-5 h-5 rounded border-2 border-gray-300 group-has-[:checked]:border-green-500 group-has-[:checked]:bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">{location.label}</span>
            </label>
          ))}
        </div>
        {errors.locations && (
          <p className="mt-3 text-sm text-red-600 flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.locations.message}</span>
          </p>
        )}
      </div>

      {/* Living Preferences */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
          </div>
          <label className="text-lg font-semibold text-gray-900">
            Important Factors (Select all that apply)
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: "proximity_to_schools", label: "Near Schools" },
            { key: "proximity_to_transport", label: "Near Transport" },
            { key: "proximity_to_amenities", label: "Near Amenities" },
            { key: "quiet_neighborhood", label: "Quiet Area" },
            { key: "expat_community", label: "Expat Community" },
            { key: "work_from_home_space", label: "Home Office Space" },
            { key: "short_term_rental_friendly", label: "Rental Friendly" },
            { key: "investment_potential", label: "High ROI Potential" }
          ].map((pref) => (
            <label key={pref.key} className="group relative flex items-center space-x-3 cursor-pointer bg-gray-50 rounded-xl p-3 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 has-[:checked]:ring-2 has-[:checked]:ring-purple-200">
              <input
                type="checkbox"
                {...register(`livingPreferences.${pref.key}` as const)}
                className="sr-only"
              />
              <div className="w-5 h-5 rounded border-2 border-gray-300 group-has-[:checked]:border-purple-500 group-has-[:checked]:bg-purple-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">{pref.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Education Preferences */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <label className="text-lg font-semibold text-gray-900">
            Education Preferences
          </label>
        </div>
        
        <div className="space-y-6">
          {/* School Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred School Types
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: "public", label: "Public Schools" },
                { value: "private", label: "Private Schools" },
                { value: "international", label: "International Schools" },
                { value: "bilingual", label: "Bilingual Schools" },
                { value: "montessori", label: "Montessori" },
                { value: "waldorf", label: "Waldorf" }
              ].map((school) => (
                <label key={school.value} className="group relative flex items-center space-x-3 cursor-pointer bg-gray-50 rounded-xl p-3 border-2 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-50 has-[:checked]:ring-2 has-[:checked]:ring-yellow-200">
                  <input
                    type="checkbox"
                    value={school.value}
                    {...register("educationPreferences.school_types")}
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded border-2 border-gray-300 group-has-[:checked]:border-yellow-500 group-has-[:checked]:bg-yellow-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{school.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Language Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Language Preferences
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: "spanish", label: "Spanish" },
                { value: "english", label: "English" },
                { value: "french", label: "French" },
                { value: "german", label: "German" },
                { value: "other", label: "Other Languages" }
              ].map((lang) => (
                <label key={lang.value} className="group relative flex items-center space-x-3 cursor-pointer bg-gray-50 rounded-xl p-3 border-2 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-50 has-[:checked]:ring-2 has-[:checked]:ring-yellow-200">
                  <input
                    type="checkbox"
                    value={lang.value}
                    {...register("educationPreferences.language_preferences")}
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded border-2 border-gray-300 group-has-[:checked]:border-yellow-500 group-has-[:checked]:bg-yellow-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{lang.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Education Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Education Levels Needed
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: "preschool", label: "Preschool" },
                { value: "primary", label: "Primary School" },
                { value: "secondary", label: "Secondary School" },
                { value: "university", label: "University" },
                { value: "adult_education", label: "Adult Education" }
              ].map((level) => (
                <label key={level.value} className="group relative flex items-center space-x-3 cursor-pointer bg-gray-50 rounded-xl p-3 border-2 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-50 has-[:checked]:ring-2 has-[:checked]:ring-yellow-200">
                  <input
                    type="checkbox"
                    value={level.value}
                    {...register("educationPreferences.education_level_needed")}
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded border-2 border-gray-300 group-has-[:checked]:border-yellow-500 group-has-[:checked]:bg-yellow-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Proximity Importance */}
          <div>
            <label htmlFor="proximityImportance" className="block text-sm font-medium text-gray-700 mb-2">
              How important is proximity to schools?
            </label>
            <select
              id="proximityImportance"
              {...register("educationPreferences.proximity_importance")}
              className="w-full md:w-1/2 rounded-xl border-2 border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select importance level</option>
              <option value="not_important">Not Important</option>
              <option value="somewhat_important">Somewhat Important</option>
              <option value="very_important">Very Important</option>
              <option value="essential">Essential</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property Appreciation Preferences */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <label className="text-lg font-semibold text-gray-900">
            Property Appreciation Preferences
          </label>
        </div>
        
        <div className="space-y-6">
          {/* Growth Expectations */}
          <div>
            <label htmlFor="growthExpectations" className="block text-sm font-medium text-gray-700 mb-2">
              Growth Expectations
            </label>
            <select
              id="growthExpectations"
              {...register("propertyAppreciationPreferences.growth_expectations")}
              className="w-full md:w-1/2 rounded-xl border-2 border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select growth expectations</option>
              <option value="conservative">Conservative (3-5% annually)</option>
              <option value="moderate">Moderate (5-8% annually)</option>
              <option value="aggressive">Aggressive (8%+ annually)</option>
              <option value="no_preference">No Specific Preference</option>
            </select>
          </div>

          {/* Market Factors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Important Market Factors for Appreciation
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: "tourism_growth", label: "Tourism Growth" },
                { value: "infrastructure_development", label: "Infrastructure Development" },
                { value: "tech_sector_growth", label: "Tech Sector Growth" },
                { value: "population_growth", label: "Population Growth" },
                { value: "gentrification", label: "Gentrification Potential" },
                { value: "coastal_premium", label: "Coastal Premium" },
                { value: "historical_significance", label: "Historical Significance" }
              ].map((factor) => (
                <label key={factor.value} className="group relative flex items-center space-x-3 cursor-pointer bg-gray-50 rounded-xl p-3 border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 has-[:checked]:border-red-500 has-[:checked]:bg-red-50 has-[:checked]:ring-2 has-[:checked]:ring-red-200">
                  <input
                    type="checkbox"
                    value={factor.value}
                    {...register("propertyAppreciationPreferences.market_factors")}
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded border-2 border-gray-300 group-has-[:checked]:border-red-500 group-has-[:checked]:bg-red-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{factor.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Investment Horizon and Risk Tolerance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="investmentHorizon" className="block text-sm font-medium text-gray-700 mb-2">
                Investment Horizon
              </label>
              <select
                id="investmentHorizon"
                {...register("propertyAppreciationPreferences.investment_horizon")}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select investment horizon</option>
                <option value="short_term">Short-term (1-3 years)</option>
                <option value="medium_term">Medium-term (3-7 years)</option>
                <option value="long_term">Long-term (7+ years)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-700 mb-2">
                Risk Tolerance
              </label>
              <select
                id="riskTolerance"
                {...register("propertyAppreciationPreferences.risk_tolerance")}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select risk tolerance</option>
                <option value="low">Low Risk</option>
                <option value="moderate">Moderate Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities Preferences */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <label className="text-lg font-semibold text-gray-900">
            Local Amenities Preferences
          </label>
        </div>
        
        <div className="space-y-6">
          {/* Essential Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Essential Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { value: "hospitals", label: "Hospitals" },
                { value: "shopping_centers", label: "Shopping Centers" },
                { value: "restaurants", label: "Restaurants" },
                { value: "gyms", label: "Gyms" },
                { value: "parks", label: "Parks" },
                { value: "beaches", label: "Beaches" },
                { value: "museums", label: "Museums" },
                { value: "theaters", label: "Theaters" },
                { value: "libraries", label: "Libraries" },
                { value: "banks", label: "Banks" }
              ].map((amenity) => (
                <label key={amenity.value} className="group relative flex items-center space-x-3 cursor-pointer bg-gray-50 rounded-xl p-3 border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50 has-[:checked]:ring-2 has-[:checked]:ring-teal-200">
                  <input
                    type="checkbox"
                    value={amenity.value}
                    {...register("amenitiesPreferences.essential_amenities")}
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded border-2 border-gray-300 group-has-[:checked]:border-teal-500 group-has-[:checked]:bg-teal-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Lifestyle Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Lifestyle Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { value: "golf_courses", label: "Golf Courses" },
                { value: "marinas", label: "Marinas" },
                { value: "ski_resorts", label: "Ski Resorts" },
                { value: "hiking_trails", label: "Hiking Trails" },
                { value: "cycling_paths", label: "Cycling Paths" },
                { value: "nightlife", label: "Nightlife" },
                { value: "farmers_markets", label: "Farmers Markets" },
                { value: "art_galleries", label: "Art Galleries" },
                { value: "music_venues", label: "Music Venues" },
                { value: "sports_facilities", label: "Sports Facilities" }
              ].map((amenity) => (
                <label key={amenity.value} className="group relative flex items-center space-x-3 cursor-pointer bg-gray-50 rounded-xl p-3 border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50 has-[:checked]:ring-2 has-[:checked]:ring-teal-200">
                  <input
                    type="checkbox"
                    value={amenity.value}
                    {...register("amenitiesPreferences.lifestyle_amenities")}
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded border-2 border-gray-300 group-has-[:checked]:border-teal-500 group-has-[:checked]:bg-teal-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Proximity Importance */}
          <div>
            <label htmlFor="amenitiesProximity" className="block text-sm font-medium text-gray-700 mb-2">
              How close do amenities need to be?
            </label>
            <select
              id="amenitiesProximity"
              {...register("amenitiesPreferences.proximity_importance")}
              className="w-full md:w-1/2 rounded-xl border-2 border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select proximity preference</option>
              <option value="walking_distance">Walking Distance (&lt; 1km)</option>
              <option value="short_drive">Short Drive (1-5km)</option>
              <option value="reasonable_distance">Reasonable Distance (5-15km)</option>
              <option value="not_important">Distance Not Important</option>
            </select>
          </div>
        </div>
      </div>

      {/* Area Comparison and Questions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <label className="text-lg font-semibold text-gray-900">
            Additional Options
          </label>
        </div>

        <div className="space-y-6">
          {/* Area Comparison */}
          <div>
            <label className="group relative flex items-center space-x-3 cursor-pointer bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 has-[:checked]:ring-2 has-[:checked]:ring-orange-200">
              <input
                type="checkbox"
                {...register("compareAreas")}
                className="sr-only"
              />
              <div className="w-5 h-5 rounded border-2 border-gray-300 group-has-[:checked]:border-orange-500 group-has-[:checked]:bg-orange-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Provide detailed comparison between selected areas
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Check this to get side-by-side analysis of education options, property appreciation potential, and amenities across your selected locations.
                </p>
              </div>
            </label>
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
              placeholder="Any specific questions about Spanish real estate, visa requirements, tax implications, family considerations, or other needs..."
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            />
            {errors.specificQuestions && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.specificQuestions.message}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100 min-w-[200px]"
        >
          {isLoading ? (
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating Advice...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Get Investment Advice</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
}
