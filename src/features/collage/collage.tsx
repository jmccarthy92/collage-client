import { useGifNotification } from "@features/notification/useGifNotification";
import React, { useCallback, useEffect, useState } from "react";
import { GifUrl } from "@shared/types";
import "./styles.css";
import { slide as Menu } from "react-burger-menu";
import { Form, Gif, currentTime, FetchGifParams } from "@features/collage";

const MAX_ITEM_COUNT = 2;
const ARROW_CHAR_CODE = String.fromCharCode(8594);

const SERVERLESS_URL =
  process.env.SERVERLESS_URL || "http://localhost:7071/api/getGifCollageState";

interface GifLastPostedState {
  [key: string]: number;
}

const Collage: React.FC = () => {
  const [gifLastPosted, setGifLastPosted] = useState<GifLastPostedState>({});
  const [gifUrls, setGifUrls] = useState<GifUrl[]>([]);
  const [continuationToken, setToken] = useState<string>();

  const gifHanlder = (url: GifUrl) => {
    setGifUrls((urls) => [...urls, url]);
    setGifLastPosted((state: GifLastPostedState) => ({
      ...state,
      [url.id]: currentTime(),
    }));
  };

  useGifNotification({
    handler: gifHanlder,
  });

  const fetchGifs = useCallback(
    async (
      { maxItemCount, continuationToken }: FetchGifParams = {
        maxItemCount: MAX_ITEM_COUNT,
      }
    ) => {
      const params = new URLSearchParams({
        maxItemCount: maxItemCount.toString(),
        ...(continuationToken && { continuationToken }),
      });
      const response = await fetch(`${SERVERLESS_URL}?${params}`);
      const { gifUrls, continuationToken: tokenReceived } =
        await response.json();
      setToken(tokenReceived);
      if (gifUrls)
        setGifUrls((state) => [
          ...state,
          ...gifUrls.filter(({ url }: GifUrl) => Boolean(url)),
        ]);
    },
    []
  );

  useEffect(() => {
    fetchGifs();
  }, [fetchGifs]);

  const onPageNext = () => {
    fetchGifs({
      continuationToken,
      maxItemCount: MAX_ITEM_COUNT,
    });
  };

  const onClear = () => {
    setGifUrls([]);
  };

  const onAnimationEnd = (id: string) => {
    setGifUrls((giflUrls) => giflUrls.filter((gif) => gif.id !== id));
  };

  return (
    <div className="main">
      <div className="bm-wrap">
        <Menu>
          <Form className="menu-item" />
        </Menu>
      </div>
      {gifUrls.map((gif) => (
        <Gif
          {...gif}
          key={gif.id}
          onAnimationEnd={onAnimationEnd}
          lastPosted={gifLastPosted[gif.id]}
        />
      ))}
      <button className="button page-next" onClick={onPageNext}>
        {ARROW_CHAR_CODE}
      </button>
      <button className="button page-clear" onClick={onClear}>
        Clear
      </button>
    </div>
  );
};

export default Collage;
