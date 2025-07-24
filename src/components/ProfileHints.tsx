interface ProfileHintsProps {
  selectedProfile: string | null;
}

export function ProfileHints({ selectedProfile }: ProfileHintsProps) {
  if (!selectedProfile) return null;

  const profileHints = {
    investor: {
      title: "Investment Focus",
      hints: [
        "ROI analysis and rental yield calculations",
        "Market trends and capital appreciation potential",
        "Tax optimization strategies for international investors",
        "Property management and exit strategies"
      ],
      color: "emerald",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    expatriate: {
      title: "Expatriate Considerations",
      hints: [
        "Residency requirements and visa implications",
        "Integration into local communities",
        "Banking and healthcare access",
        "Long-term settlement planning"
      ],
      color: "blue",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    digital_nomad: {
      title: "Digital Nomad Needs",
      hints: [
        "Flexible rental options and short-term arrangements",
        "Internet connectivity and coworking spaces",
        "Transportation hub proximity",
        "Vibrant expat communities"
      ],
      color: "purple",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    family: {
      title: "Family Priorities",
      hints: [
        "School districts and educational opportunities",
        "Family-friendly neighborhoods and safety",
        "Healthcare and pediatric services",
        "Parks and recreational facilities"
      ],
      color: "orange",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  };

  const profile = profileHints[selectedProfile as keyof typeof profileHints];
  if (!profile) return null;

  const colorClasses = {
    emerald: "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-900",
    blue: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-900",
    purple: "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-900",
    orange: "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-900"
  };

  const iconColorClasses = {
    emerald: "bg-gradient-to-r from-emerald-500 to-teal-600",
    blue: "bg-gradient-to-r from-blue-500 to-indigo-600",
    purple: "bg-gradient-to-r from-purple-500 to-pink-600",
    orange: "bg-gradient-to-r from-orange-500 to-amber-600"
  };

  return (
    <div className={`rounded-2xl border-2 p-6 mt-6 ${colorClasses[profile.color as keyof typeof colorClasses]}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${iconColorClasses[profile.color as keyof typeof iconColorClasses]}`}>
          {profile.icon}
        </div>
        <h3 className="text-lg font-bold">{profile.title}</h3>
      </div>
      <p className="text-sm font-medium mb-4 opacity-90">Your personalized advice will focus on:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {profile.hints.map((hint, index) => (
          <div key={index} className="flex items-start space-x-3 bg-white bg-opacity-50 rounded-lg p-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
            </div>
            <span className="text-sm font-medium leading-relaxed">{hint}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
