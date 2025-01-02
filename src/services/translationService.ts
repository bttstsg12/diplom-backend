export const translationService = {
  translate: async (text: string) => {
    const response = await fetch(
      'https://api-b2b.backenster.com/b1/api/v3/translate',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${process.env.LIGNVANEX_API_KEY}`,
        },
        body: JSON.stringify({
          platform: 'api',
          from: 'mn_MN',
          to: 'en_US',
          data: text,
        }),
      }
    )

    return response.json()
  },
}
