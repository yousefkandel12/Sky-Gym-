export async function generateBusinessInsights(prompt: string) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch insights from Gemini API');
  }

  const data = await response.json();
  return data.result;
}
