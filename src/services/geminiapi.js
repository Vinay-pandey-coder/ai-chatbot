const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;

export const generateContent = async (message) => {
  if (!GEMINI_API_KEY) throw new Error("Missing Gemini API key");

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API error:", errorData);

      return (
        errorData?.error?.message ||
        "⚠️ Gemini service is temporarily unavailable. Please try again later."
      );
    }

    const data = await response.json();

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
  } catch (error) {
    console.error("Error generating content:", error);

    return "⚠️ Unable to connect to Gemini. Please try again later.";
  }
};
