import axios, { AxiosError } from "axios";

//funcionalidades para transformar o endereço em geocode
  export default async function geocode(address: string | undefined, apiKey: string | unknown) {
  try {
    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          Q: address,
          key: apiKey,
        },
      }
    );

    const data = response.data;

    if (data.status.code === 200) {
      const location = data.results[0].geometry;

      return {
        lat: location.lat,
        lng: location.lng
      }
    } else {
      throw new Error('Geocoding Falhou.')
    }
  } catch (error) {
    console.error("Error during geocoding:", error as AxiosError)
    throw error
  }
}
