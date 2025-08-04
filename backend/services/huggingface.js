const { HfInference } = require("@huggingface/inference")

class HuggingFaceService {
  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY)
    this.model = "microsoft/DialoGPT-large" // Free model for conversations
  }

  async generateResponse(message, context = "") {
    try {
      const prompt = `${context}\nHuman: ${message}\nAssistant:`

      const response = await this.hf.textGeneration({
        model: "google/flan-t5-large", // Better for Q&A
        inputs: `Answer this cricket question: ${message}`,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false,
        },
      })

      return response.generated_text || "I'm sorry, I couldn't generate a response."
    } catch (error) {
      console.error("Hugging Face API error:", error)
      return "I'm experiencing some technical difficulties. Please try again later."
    }
  }

  async generateCricketResponse(message) {
    const cricketContext = `You are a cricket expert AI assistant. You have comprehensive knowledge about:
    - International cricket (ICC events, bilateral series, player statistics)
    - Indian cricket (IPL, domestic cricket, Indian team history)  
    - Cricket rules, formats (Test, ODI, T20)
    - Player records, team statistics, historical matches
    - Current cricket news and updates
    
    Provide accurate, detailed, and engaging responses about cricket.`

    return await this.generateResponse(message, cricketContext)
  }
}

module.exports = new HuggingFaceService()
