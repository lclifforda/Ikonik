import { z } from "zod";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { baseProcedure } from "~/server/trpc/main";
import { db } from "~/server/db";

export const generateRealEstateAdvice = baseProcedure
  .input(
    z.object({
      userProfile: z.enum(["investor", "expatriate", "digital_nomad", "family"]),
      investmentType: z.enum(["residential", "commercial", "vacation_rental", "mixed"]),
      budget: z.enum(["under_200k", "200k_500k", "500k_1m", "1m_2m", "over_2m"]),
      locations: z.array(z.enum(["madrid", "barcelona", "valencia", "seville", "malaga", "bilbao", "granada", "alicante", "coastal", "other"])).min(1),
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
      // Tracking parameters
      sessionId: z.string().optional(),
      userAgent: z.string().optional(),
      ipAddress: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const startTime = Date.now();
    let success = true;
    let errorMessage: string | undefined;
    
    // Generate a session ID if not provided
    const sessionId = input.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Log the user interaction
      await db.userInteraction.create({
        data: {
          sessionId,
          userAgent: input.userAgent,
          ipAddress: input.ipAddress,
          interactionType: "form_submission",
          page: "/",
          data: {
            userProfile: input.userProfile,
            investmentType: input.investmentType,
            budget: input.budget,
            locations: input.locations,
            experience: input.experience,
            timeline: input.timeline,
            livingPreferences: input.livingPreferences,
            educationPreferences: input.educationPreferences,
            propertyAppreciationPreferences: input.propertyAppreciationPreferences,
            amenitiesPreferences: input.amenitiesPreferences,
            compareAreas: input.compareAreas,
            specificQuestions: input.specificQuestions,
          },
          propertyType: input.investmentType,
          budget: input.budget,
          location: input.locations.join(", "),
          adviceGenerated: false, // Will be updated after successful generation
          success: true,
        },
      });

      // Track/update user preferences
      await db.userPreference.upsert({
        where: { sessionId },
        update: {
          preferredPropertyTypes: [input.investmentType],
          budgetRange: input.budget,
          preferredLocations: input.locations,
          visitCount: { increment: 1 },
          lastVisit: new Date(),
          mostUsedFeatures: ["real_estate_advice"],
          adviceStyle: input.specificQuestions ? "detailed" : "standard",
        },
        create: {
          sessionId,
          preferredPropertyTypes: [input.investmentType],
          budgetRange: input.budget,
          preferredLocations: input.locations,
          visitCount: 1,
          lastVisit: new Date(),
          mostUsedFeatures: ["real_estate_advice"],
          adviceStyle: input.specificQuestions ? "detailed" : "standard",
        },
      });

      const model = openai("gpt-4o");

      const budgetText = {
        under_200k: "under €200,000",
        "200k_500k": "€200,000 - €500,000",
        "500k_1m": "€500,000 - €1,000,000",
        "1m_2m": "€1,000,000 - €2,000,000",
        over_2m: "over €2,000,000",
      }[input.budget];

      const locationTexts = {
        madrid: "Madrid",
        barcelona: "Barcelona", 
        valencia: "Valencia",
        seville: "Seville",
        malaga: "Málaga",
        bilbao: "Bilbao",
        granada: "Granada",
        alicante: "Alicante",
        coastal: "Spanish coastal areas",
        other: "other Spanish regions",
      };

      const selectedLocations = input.locations.map(loc => locationTexts[loc]).join(", ");
      const isMultipleLocations = input.locations.length > 1;

      const profileDescriptions = {
        investor: "a real estate investor focused on maximizing returns and building a property portfolio",
        expatriate: "an expatriate planning to relocate to Spain for work or lifestyle reasons",
        digital_nomad: "a digital nomad seeking flexible living arrangements and location independence",
        family: "a family with children looking for a suitable home environment and community",
      };

      const profileFocus = {
        investor: `
- Investment performance metrics and ROI analysis
- Market trends and capital appreciation potential
- Rental yield opportunities and property management
- Tax optimization strategies for international investors
- Portfolio diversification and risk management
- Exit strategies and liquidity considerations`,
        expatriate: `
- Residency requirements and visa implications
- Integration into local communities and culture
- Banking, healthcare, and essential services access
- Cost of living comparisons and budgeting
- Legal requirements for property ownership
- Long-term settlement considerations`,
        digital_nomad: `
- Flexible rental options and short-term arrangements
- Internet connectivity and coworking spaces
- Proximity to airports and transportation hubs
- Vibrant expat and remote worker communities
- Cost-effective living arrangements
- Legal considerations for temporary residents`,
        family: `
- School districts and educational opportunities
- Family-friendly neighborhoods and safety
- Access to healthcare and pediatric services
- Parks, recreational facilities, and activities
- Community integration and social opportunities
- Long-term stability and growth potential`,
      };

      const systemPrompt = `You are an expert real estate advisor specializing in Spanish property for international clients. You are specifically advising ${profileDescriptions[input.userProfile]}.

Your comprehensive expertise covers:

**Core Real Estate Analysis:**
${profileFocus[input.userProfile]}

**Education System Expertise:**
- Spanish education system structure (public, private, international schools)
- Regional differences in education quality and availability
- International and bilingual school networks across Spain
- University systems and higher education opportunities
- Language immersion programs and cultural integration
- School district analysis and enrollment procedures

**Property Appreciation Analysis:**
- Regional market dynamics and growth drivers
- Infrastructure development impact on property values
- Tourism and economic development effects
- Demographic trends and population growth patterns
- Gentrification and urban development patterns
- Coastal premium and location-specific value drivers
- Historical price trends and future projections
- Risk assessment for different market segments

**Local Amenities Assessment:**
- Healthcare systems and medical facility access
- Transportation networks and connectivity
- Cultural amenities (museums, theaters, arts scene)
- Recreational facilities and lifestyle amenities
- Shopping, dining, and entertainment options
- Sports and outdoor activity availability
- Community services and expat support networks
- Banking, legal, and professional services

**Comparative Analysis Capabilities:**
- Side-by-side regional comparisons
- Cost-benefit analysis across different areas
- Quality of life assessments by location
- Investment potential rankings and rationale
- Lifestyle fit analysis for different profiles

Additional general expertise:
- Current Spanish real estate market conditions and regional differences
- Legal framework for international property buyers
- Tax implications and fiscal planning
- Property acquisition processes and timelines
- Risk assessment and mitigation strategies

Provide strategic, practical advice that is comprehensive yet accessible. When comparing multiple locations, structure your response with clear comparative sections. Your advice should be informative but not constitute formal financial or legal advice.`;

      const userProfileText = {
        investor: "As a real estate investor",
        expatriate: "As an expatriate planning to relocate to Spain",
        digital_nomad: "As a digital nomad seeking flexible living options",
        family: "As a family with children looking for a new home",
      }[input.userProfile];

      // Build preferences text
      const preferences = input.livingPreferences;
      const selectedPreferences = preferences ? Object.entries(preferences)
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key.replace(/_/g, ' '))
        .join(', ') : '';

      // Build education preferences text
      const educationPrefs = input.educationPreferences;
      let educationText = "";
      if (educationPrefs?.school_types?.length) {
        educationText += `\n**School Types Preferred:** ${educationPrefs.school_types.map(type => type.replace("_", " ")).join(", ")}`;
      }
      if (educationPrefs?.language_preferences?.length) {
        educationText += `\n**Language Preferences:** ${educationPrefs.language_preferences.join(", ")}`;
      }
      if (educationPrefs?.education_level_needed?.length) {
        educationText += `\n**Education Levels Needed:** ${educationPrefs.education_level_needed.map(level => level.replace("_", " ")).join(", ")}`;
      }
      if (educationPrefs?.proximity_importance) {
        educationText += `\n**School Proximity Importance:** ${educationPrefs.proximity_importance.replace("_", " ")}`;
      }

      // Build property appreciation preferences text
      const appreciationPrefs = input.propertyAppreciationPreferences;
      let appreciationText = "";
      if (appreciationPrefs?.growth_expectations) {
        appreciationText += `\n**Growth Expectations:** ${appreciationPrefs.growth_expectations.replace("_", " ")}`;
      }
      if (appreciationPrefs?.market_factors?.length) {
        appreciationText += `\n**Important Market Factors:** ${appreciationPrefs.market_factors.map(factor => factor.replace(/_/g, " ")).join(", ")}`;
      }
      if (appreciationPrefs?.investment_horizon) {
        appreciationText += `\n**Investment Horizon:** ${appreciationPrefs.investment_horizon.replace("_", " ")}`;
      }
      if (appreciationPrefs?.risk_tolerance) {
        appreciationText += `\n**Risk Tolerance:** ${appreciationPrefs.risk_tolerance} risk`;
      }

      // Build amenities preferences text
      const amenitiesPrefs = input.amenitiesPreferences;
      let amenitiesText = "";
      if (amenitiesPrefs?.essential_amenities?.length) {
        amenitiesText += `\n**Essential Amenities:** ${amenitiesPrefs.essential_amenities.map(amenity => amenity.replace(/_/g, " ")).join(", ")}`;
      }
      if (amenitiesPrefs?.lifestyle_amenities?.length) {
        amenitiesText += `\n**Lifestyle Amenities:** ${amenitiesPrefs.lifestyle_amenities.map(amenity => amenity.replace(/_/g, " ")).join(", ")}`;
      }
      if (amenitiesPrefs?.proximity_importance) {
        amenitiesText += `\n**Amenity Proximity Preference:** ${amenitiesPrefs.proximity_importance.replace("_", " ")}`;
      }

      const comparisonInstruction = input.compareAreas && isMultipleLocations 
        ? "\n\n**IMPORTANT: Please provide a detailed comparative analysis between the selected locations, with side-by-side comparisons for education options, property appreciation potential, and local amenities. Structure your response with clear comparison sections.**"
        : "";

      const userPrompt = `${userProfileText}, I am seeking comprehensive real estate advice for the Spanish market with the following requirements:

**Investment Profile:**
- Property Type: ${input.investmentType.replace("_", " ")}
- Budget Range: ${budgetText}
- Target Location${isMultipleLocations ? 's' : ''}: ${selectedLocations}
- Experience Level: ${input.experience}
- Investment Timeline: ${input.timeline.replace("_", " ")}

${selectedPreferences ? `**General Living Preferences:**\n${selectedPreferences}\n` : ''}

${educationText ? `**Education Requirements:**${educationText}\n` : ''}

${appreciationText ? `**Property Appreciation Preferences:**${appreciationText}\n` : ''}

${amenitiesText ? `**Amenities Preferences:**${amenitiesText}\n` : ''}

${input.specificQuestions ? `**Specific Questions:**\n${input.specificQuestions}\n` : ''}

Please provide comprehensive advice covering:

1. **Education Options Analysis** - Detailed insights on school systems, quality, availability, and costs in the selected region${isMultipleLocations ? 's' : ''}
2. **Property Appreciation Potential** - Market analysis, growth drivers, historical trends, and future outlook for property values
3. **Local Amenities Assessment** - Comprehensive overview of healthcare, transportation, cultural, recreational, and lifestyle amenities
4. **Investment Strategy** - Tailored recommendations based on my profile and preferences
5. **Legal & Tax Considerations** - Key requirements and implications for international buyers
6. **Practical Next Steps** - Actionable guidance for moving forward

${comparisonInstruction}

Focus on providing detailed, practical insights that help me make informed decisions about ${isMultipleLocations ? 'which area best suits my needs and' : ''} the most suitable investment approach for my situation as ${profileDescriptions[input.userProfile]}.`;

      const { text } = await generateText({
        model,
        system: systemPrompt,
        prompt: userPrompt,
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Log the successful query
      await db.queryLog.create({
        data: {
          queryType: "real_estate_advice",
          queryText: userPrompt.substring(0, 1000), // Truncate for storage
          parameters: {
            userProfile: input.userProfile,
            investmentType: input.investmentType,
            budget: input.budget,
            locations: input.locations,
            experience: input.experience,
            timeline: input.timeline,
          },
          sessionId,
          userAgent: input.userAgent,
          responseTime,
          success: true,
          category: input.userProfile,
          tags: [
            input.investmentType,
            input.budget,
            input.experience,
            ...input.locations,
            ...(isMultipleLocations ? ["multi_location_comparison"] : []),
            ...(input.compareAreas ? ["area_comparison"] : []),
          ],
        },
      });

      // Update the user interaction to mark advice as generated
      await db.userInteraction.updateMany({
        where: {
          sessionId,
          interactionType: "form_submission",
          adviceGenerated: false,
        },
        data: {
          adviceGenerated: true,
          responseTime,
          success: true,
        },
      });

      // Log the advice generation as a separate interaction
      await db.userInteraction.create({
        data: {
          sessionId,
          userAgent: input.userAgent,
          ipAddress: input.ipAddress,
          interactionType: "advice_generation",
          page: "/",
          data: {
            queryLength: userPrompt.length,
            responseLength: text.length,
            locations: input.locations,
            userProfile: input.userProfile,
          },
          propertyType: input.investmentType,
          budget: input.budget,
          location: input.locations.join(", "),
          adviceGenerated: true,
          responseTime,
          success: true,
        },
      });

      return {
        advice: text,
        sessionId, // Return session ID for potential future tracking
      };

    } catch (error) {
      success = false;
      errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Log the failed query
      await db.queryLog.create({
        data: {
          queryType: "real_estate_advice",
          queryText: "Failed query attempt",
          parameters: {
            userProfile: input.userProfile,
            investmentType: input.investmentType,
            budget: input.budget,
            locations: input.locations,
          },
          sessionId,
          userAgent: input.userAgent,
          responseTime,
          success: false,
          errorType: errorMessage,
          category: input.userProfile,
          tags: ["error", input.userProfile],
        },
      });

      // Update user interaction to reflect failure
      await db.userInteraction.updateMany({
        where: {
          sessionId,
          interactionType: "form_submission",
          adviceGenerated: false,
        },
        data: {
          responseTime,
          success: false,
          errorMessage,
        },
      });

      throw error;
    }
  });
