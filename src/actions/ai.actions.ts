'use server'

import { AiService } from "@/services/ai.service";

// Generate an Article
export const generateArticle = async ({prompt}:{prompt:string}) => {
  return await AiService.generateArticle(prompt);
};

// Generate Recommendations
export const generateRecommendations = async (input: any) => {
  return await AiService.generateRecommendations(input);
};

// Chat Assistant
export const chatAssistant = async (prompt: any) => {
  return await AiService.chatAssistant(prompt);
};

// Generate Admin Analytics
export const generateAdminAnalytics = async (input?: any) => {
  return await AiService.generateAdminAnalytics(input);
};