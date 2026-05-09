import { env } from "@/env";
import { cookies } from "next/headers";



const API_BASE_URL = env.BACKEND_URL;
console.log(API_BASE_URL,'slkjfsdf')
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.");
}

export const AiService = {
  // Generate an Article
  generateArticle: async (prompt: string) => {
    const storeCookies = await cookies();
    console.log(prompt,'prompt')
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/ai/generate-artical`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: storeCookies.toString(),
        },
        body: JSON.stringify({ prompt }),
      });
      const body = await response.json();
      console.log(body,'boydata')
      if (!response.ok) {
        const error = body;
        return { success: false, message: error.message };
      }
      return {
        success: true,
        message: body.message || "Article generated successfully",
        data: body.data,
        response: body.response,
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },

  // Generate Recommendations
  generateRecommendations: async (input: any) => {
    const storeCookies = await cookies();
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/ai/generate-recommendations`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: storeCookies.toString(),
        },
        body: JSON.stringify(input),
      });
      const body = await response.json();
      if (!response.ok) {
        const error = body 
        return { success: false, message: error.message };
      }
      return {
        success: true,
        message: body.message || "Recommendations generated successfully",
        data: body.data,
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },

  // Chat Assistant
  chatAssistant: async (prompt: string) => {
    const storeCookies = await cookies();
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/ai/chat-assistand`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: storeCookies.toString(),
        },
        body: JSON.stringify({ prompt }),
      });
      const body = await response.json();
      if (!response.ok) {
        const error = body 
        return { success: false, message: error.message };
      }
      return {
        success: true,
        message: body.message || "Chat response generated",
        data: body.data,
        response: body.response,
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },

  // Generate Admin Analytics
  generateAdminAnalytics: async (input?: any) => {
    const storeCookies = await cookies();
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/ai/generate-admin-analytics`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: storeCookies.toString(),
        },
        body: JSON.stringify(input ?? {}),
      });
      const body = await response.json();
      if (!response.ok) {
        const error = body 
        return { success: false, message: error.message };
      }
      return {
        success: true,
        message: body.message || "Admin analytics generated successfully",
        data: body.data,
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },
};