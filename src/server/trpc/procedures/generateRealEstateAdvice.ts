import { z } from "zod";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { baseProcedure } from "~/server/trpc/main";

export const generateRealEstateAdvice = baseProcedure
  .input(
    z.object({
      investmentType: z.enum(["residential", "commercial", "vacation_rental", "mixed"]),
      budget: z.enum(["under_200k", "200k_500k", "500k_1m", "1m_2m", "over_2m"]),
      location: z.enum(["madrid", "barcelona", "valencia", "seville", "malaga", "coastal", "other"]),
      experience: z.enum(["beginner", "intermediate", "experienced"]),
      timeline: z.enum(["immediate", "6_months", "1_year", "2_years_plus"]),
      specificQuestions: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const model = openai("gpt-4o");

    const budgetText = {
      under_200k: "under €200,000",
      "200k_500k": "€200,000 - €500,000",
      "500k_1m": "€500,000 - €1,000,000",
      "1m_2m": "€1,000,000 - €2,000,000",
      over_2m: "over €2,000,000",
    }[input.budget];

    const locationText = {
      madrid: "Madrid",
      barcelona: "Barcelona", 
      valencia: "Valencia",
      seville: "Seville",
      malaga: "Málaga",
      coastal: "Spanish coastal areas",
      other: "other Spanish regions",
    }[input.location];

    const systemPrompt = `You are an expert real estate advisor specializing in Spanish property investment for international investors. You provide strategic, practical advice covering market trends, investment opportunities, legal considerations, and fiscal implications. Your advice should be informative but not constitute formal financial or legal advice.

Focus on:
- Current market conditions and trends in Spain
- Investment potential and expected returns
- Legal requirements for foreign investors
- Tax implications and fiscal considerations
- Practical steps for property acquisition
- Regional market differences
- Risk factors and mitigation strategies

Keep responses comprehensive but concise, well-structured with clear sections, and tailored to the investor's profile.`;

    const userPrompt = `Please provide strategic real estate investment advice for an international investor with the following profile:

**Investment Details:**
- Property Type: ${input.investmentType.replace("_", " ")}
- Budget Range: ${budgetText}
- Preferred Location: ${locationText}
- Experience Level: ${input.experience}
- Investment Timeline: ${input.timeline.replace("_", " ")}

${input.specificQuestions ? `**Specific Questions:**\n${input.specificQuestions}` : ""}

Please provide comprehensive advice covering market analysis, investment strategy, legal considerations, tax implications, and practical next steps.`;

    const { text } = await generateText({
      model,
      system: systemPrompt,
      prompt: userPrompt,
    });

    return {
      advice: text,
    };
  });
