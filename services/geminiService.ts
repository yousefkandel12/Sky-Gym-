export async function getGeminiResponse(prompt: string) {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Error in geminiService:", error);
    return "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.";
  }
}
