import OpenAI from 'openai'

export const openAIService = {
  generate: async (type: string, description: string) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Generate an image of a ${type} with the following description: ${description}`,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    })

    return {
      image: response.data[0].b64_json,
    }
  },
}
