
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Function to generate personalized financial advice
const getFinancialAdvice = async (totalBudget, availableBalance, totalSpend) => {
  console.log(totalBudget, availableBalance, totalSpend);

  try {
    // Use 'gemini-pro' which is available in the free tier
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Based on the following financial data:
      - Total Budget: ${totalBudget} NPR 
      - Expenses: ${totalSpend} NPR 
      - Incomes: ${availableBalance} NPR
      Provide detailed financial advice in 2 sentences to help the user manage their finances more effectively.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const advice = response.text();

    console.log(advice);
    return advice;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;