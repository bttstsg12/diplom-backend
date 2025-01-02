export const imageGeneratorService = {
  generate: async (type: string, description: string) => {
    const response = await fetch(
      'https://api.getimg.ai/v1/flux-schnell/text-to-image',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: `Generate an image of a ${type} with the following description: ${description}`,
        }),
      }
    )

    return response.json()
  },
  edit: async (imageData: string, description: string) => {
    const response = await fetch(
      'https://api.getimg.ai/v1/stable-diffusion/instruct',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: `Edit the image with the following command: ${description}`,
          image: imageData,
        }),
      }
    )

    return response.json()
  },
}
