import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_TOKEN);

export async function askQwen(message) {
  try {
    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: [
        {
          role: "system",
          content:
            "You are Carvia AI, a career and job assistant. Help users find jobs, understand required skills, identify skill gaps, improve resumes, and make career decisions. Give practical and concise answers focused on jobs and careers."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    console.log("QWEN RESPONSE RECEIVED");

    return response.choices[0].message.content;

  } catch (error) {
    console.error("========== QWEN ERROR ==========");
    console.error("Name:", error?.name);
    console.error("Message:", error?.message);
    console.error("Status:", error?.status);
    console.error("Response:", error?.response?.data);
    console.error("================================");

    throw error;
  }
}