'use client'

import { useEffect } from 'react';

type AdBannerProps = {
  dataAdSlot: string;
  dataAdClient: string;
};

export default function AdBanner({ dataAdSlot, dataAdClient }: AdBannerProps) {
  useEffect(() => {
    try {
      // This triggers the Google Adsense script to find and fill this empty div
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err: any) {
      console.error("AdSense error:", err.message);
    }
  }, []);

  return (
    <div className="w-full overflow-hidden my-4 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={dataAdClient}
        data-ad-slot={dataAdSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}