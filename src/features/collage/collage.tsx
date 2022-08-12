import { useGifNotification } from "../notification/useGifNotification";
import React, { useEffect, useState } from "react";
import Form from "./form";

const SERVERLESS_URL =
  process.env.SERVERLESS_URL || "http://localhost:7071/api/getGifCollageState";

const Collage: React.FC = () => {
  const [gifUrls, setGifUrls] = useState<string[]>([]);
  useGifNotification({
    handler: (url) => {
      setGifUrls((urls) => [...urls, url]);
    },
  });

  useEffect(() => {
    const fetchGifs = async () => {
      const response = await fetch(SERVERLESS_URL);
      const jsonResponse = await response.json();
      const gifUrls = jsonResponse
        .filter(({ url }: any) => Boolean(url))
        .map(({ url }: any) => url);
      if (jsonResponse) setGifUrls(gifUrls);
    };
    fetchGifs();
  }, []);

  return (
    <div>
      <div>
        <Form />
      </div>
      {gifUrls.map((url) => (
        <img key={url} src={url} alt={url} />
      ))}
    </div>
  );
};

export default Collage;
