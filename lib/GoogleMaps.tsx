'use client'
import { useEffect, useRef } from "react";
import { Loader } from '@googlemaps/js-api-loader';

//import lib function
import geocode from "./Geocode";

interface GoogleMapsPropsType {
  address: string | undefined,
}

function GoogleMaps({ address }: GoogleMapsPropsType) {
  const opencageApiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  
  
  const mapRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: "quarterly",
      });
      
      const { Map } = await loader.importLibrary('maps');

      const location = await geocode(address, opencageApiKey);
      
      const locationInMap = {
        lat: location.lat ? location.lat : -16.67861,
        lng: location.lng ? location.lng : -49.25389,
      };

      //marker
      const { Marker } = (await loader.importLibrary('marker')) as google.maps.MarkerLibrary;

      const options: google.maps.MapOptions = {
        center: locationInMap,
        zoom: 18,
        mapId: 'Schools_Maps',
      };

      const map = new Map(mapRef.current as HTMLDivElement, options)

      //adicionar maker no mapa
      const marker = new Marker({
        map: map,
        position: locationInMap
      })
    }

    initMap();
  }, [address, opencageApiKey])

  return ( 
    <div className="h-[100vh] rounded-md"  ref={mapRef}/>
   );
}

export default GoogleMaps;