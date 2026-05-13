"use server"
import { env } from "@/env";
import { deleteCookie } from "@/lib/cookiesUtils";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { Ilogin, TAuthData } from "@/types/auth.type";
import { ApiErrorResponse, ApiResponse } from "@/types/response.type";
import { TUser, UserCreateInput } from "@/types/user.type";
import { cookies } from "next/headers";
const api_url = env.BACKEND_URL;



export async function getNewTokensWithRefreshToken(refreshToken  : string) : Promise<boolean> {
    try {
const res = await fetch(`${api_url}/api/v1/auth/refresh-token`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Cookie : `refreshToken=${refreshToken}`
            }
        });

        if(!res.ok){
            return false;
        }

        const {data} = await res.json();

        const { accessToken, refreshToken: newRefreshToken, token } = data;

        if(accessToken){
            await setTokenInCookies("accessToken", accessToken);
        }

        if(newRefreshToken){
            await setTokenInCookies("refreshToken", newRefreshToken);
        }

        if(token){
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); 
        }

        return true;
    } catch (error) {
       
        return false;
    }
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
    if (!cookieHeader) {
      return null;
    }
    const res = await fetch(`${api_url}/api/v1/auth/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });
    const session = await res.json();
    if (!session) {
      return { data: null, error: "No session" };
    }
    return { success:session.success,message:session.message,data:session.data};
  } catch (e: any) {
    return { data: null, error: "server error" };
  }
}
export async function registerUser(registerData: UserCreateInput) {
  try {
    const formData = new FormData();

    const { image, ...rest } = registerData;

    formData.append("data", JSON.stringify(rest));
    if (image) {
      formData.append("file", image);
    }
    const response = await fetch(`${api_url}/api/v1/auth/register`, {
      method: "POST",
      body: formData
    });
    const body= await response.json();
    if (!response.ok || !body.success) {
      const data = body as ApiErrorResponse;
      return {
       success:data.success,
       message:data.message
      };
    }
    return { success:body.success,message:body.message,data:body.data };
  } catch (error) {
    return { data: null, error: "server error" };
  }
}


export async function loginUser(logindata: Ilogin) {
  console.log(logindata,'logindata')
  try {
    const storeCookies = await cookies();
    const response = await fetch(`${api_url}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: storeCookies.toString(),
      },
      cache: "no-store",
      body: JSON.stringify(logindata),
    });
    console.log(response,'responsivedata')
    const body = await response.json();
    console.log(body,'bodydata')
    const result =body as ApiResponse<TAuthData>
    if (!response.ok || !body.success) {
      const error = body as ApiErrorResponse;
      return {
        success:error.success,
        message: error.message || "Login failed",
      };
    }

    const { accessToken, refreshToken: newRefreshToken, token } = body.data;

    if (accessToken) {
      await setTokenInCookies("accessToken", accessToken);
    }

    if (newRefreshToken) {
      await setTokenInCookies("refreshToken", newRefreshToken);
    }

    if (token) {
      await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
    }
    return { success:result.success, message:result.message,data:result.data };
  } catch (error) {
    return { data: null, error: "server error" };
  }
}

export async function Logout() {
  const storeCookies = await cookies();
  const response = await fetch(`${api_url}/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: storeCookies.toString(),
    },
    cache: "no-store",
  });
  const body= await response.json();
  console.log(body,'body')
  const result = body as ApiResponse<TAuthData> 
  if (!response.ok || !body.success) {
    const data = body as ApiErrorResponse;
    return {
      data: null,
      error: data.message || "Logout failed",
    };
  }
    deleteCookie("accessToken"),
    deleteCookie("refreshToken"),
    deleteCookie("better-auth.session_token")
return {
    success: true,
    message: result.message || "Logged out successfully!",
    data: result.data,
};

}

export const verifyEmail = async (verifyData: { email: string; otp: string }) => {
  try {
    const storeCookies = await cookies();
    const response = await fetch(`${api_url}/api/v1/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: storeCookies.toString(),
      },
      cache: "no-store",
      body: JSON.stringify(verifyData),
    });
    const body = await response.json();
    const result = body as ApiResponse<any>;
    if (!response.ok) {
      const error = body as ApiErrorResponse;
      return { success: error.success, message: error.message };
    }
    return {
      success: true,
      message: result.message || "Email successfully verified!",
      data: result.data,
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Server error" };
  }
};

export const resendVerificationCode = async ({ email }: { email: string }) => {
  try {
    const storeCookies = await cookies();
    const response = await fetch(`${api_url}/api/v1/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: storeCookies.toString(),
      },
      cache: "no-store",
      body: JSON.stringify({ email, type: "email-verification" }),
    });
    const body = await response.json();
    const result = body as ApiResponse<any>;
    if (!response.ok) {
      const error = body as ApiErrorResponse;
      return { success: error.success, message: error.message };
    }
    return {
      success: true,
      message: result.message || "Verification code resent successfully!",
      data: result.data,
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Server error" };
  }
};


export const ForgotPasswordEmailOTP: any = async ({ email }: { email: string }) => {
  try {
    const storeCookies = await cookies();
    const response = await fetch(`${api_url}/api/v1/auth/forget-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: storeCookies.toString(),
      },
      cache: "no-store",
      body: JSON.stringify({ email }),
    });
    const body = await response.json();
    const result = body as ApiResponse<any>;
    if (!response.ok) {
      const error = body as ApiErrorResponse;
      return { success: error.success, message: error.message, url: "/login" };
    }
    return {
      success: true,
      message: result.message || "Password reset OTP sent successfully!",
      data: result.data,
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Server error" };
  }
};

export const ResetPassword = async ({
  email,
  otp,
  newPassword,
}: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  try {
    const storeCookies = await cookies();
    const response = await fetch(`${api_url}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: storeCookies.toString(),
      },
      cache: "no-store",
      body: JSON.stringify({
        email,
        otp,
        newPassword,
      }),
    });
    const body = await response.json();
    const result = body as ApiResponse<any>;
    if (!response.ok) {
      const error = body as ApiErrorResponse;
      return {
        success: error.success,
        message: error.message,
        url: "/login",
      };
    }
    return {
      success: true,
      message: result.message || "Password reset successfully!",
      data: result.data,
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Server error" };
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const storeCookies = await cookies();
    const response = await fetch(`${api_url}/api/v1/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: storeCookies.toString(),
      },
      cache: "no-store",
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
    const body = await response.json();

    if (!response.ok) {
      const error = body as ApiErrorResponse;
      return {
        success: error.success || false,
        message: error.message || "Failed to change password",
      };
    }

    const result = body as ApiResponse<any>;
    return {
      success: result.success,
      message: result.message || "Password changed successfully!",
      data: result.data,
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Server error" };
  }
};