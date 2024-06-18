'use client'
import { useEffect, useRef } from "react";
import { Loader } from '@googlemaps/js-api-loader';

//import lib function
import geocode from "./Geocode";
import Image from "next/image";

//import icons
import NoLocation from "@/public/No-location.svg";

interface GoogleMapsPropsType {
  address: string | undefined,
}

function GoogleMaps({ address }: GoogleMapsPropsType) {
  const opencageApiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  
  
  const mapRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        version: "quarterly",
      });
      
      const { Map } = await loader.importLibrary('maps');

      const parsedAddress = address ? address : "São Paulo, São Paulo, Brazil";

      const location = await geocode(parsedAddress, opencageApiKey);
      
      const locationInMap = {
        lat: location?.lat ? location.lat : "-16.67861",
        lng: location?.lng ? location.lng : "-49.25389",
      };

      //marker
      const { AdvancedMarkerElement } = (await loader.importLibrary('marker')) as google.maps.MarkerLibrary;

      const options: google.maps.MapOptions = {
        center: locationInMap,
        zoom: 18,
        mapId: 'Schools_Maps',
      };

      const map = new Map(mapRef.current as HTMLDivElement, options)

      //adicionar maker no mapa
      new AdvancedMarkerElement({
        map: map,
        position: locationInMap
      })
    }

    if (address && mapRef) {
      initMap();
    }
  }, [address, opencageApiKey])

  return (
      address ? (
        <div className="map rounded-md"  ref={mapRef}/>
      ) : (
        <Image src={NoLocation} alt="Endereço não encontrado." height={100} width={100} className="m-auto"/>
      )
   );
}

export default GoogleMaps;