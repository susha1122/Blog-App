import { IKImage } from "imagekitio-react";

const Image = ({ src, className, w, h, alt }) => {
  const urlEndpoint = import.meta.env.VITE_IK_URL_ENDPOINT;

  // Auto-detect if src is a full URL
  const isFullUrl = /^https?:\/\//.test(src);

  const transformations = w || h ? [{ width: w, height: h }] : [];

  // FULL URL → no transformations allowed
  if (isFullUrl) {
    return (
      <IKImage
        urlEndpoint={urlEndpoint}
        src={src}               // full URL
        transformation={[]}     // no transforms (required!)
        loading="lazy"
        lqip={{ active: true, quality: 20 }}
        alt={alt}
        className={className}
      />
    );
  }

  // IMAGEKIT PATH → allow transformations
  return (
    <IKImage
      urlEndpoint={urlEndpoint}
      path={src}               // ImageKit path only
      transformation={transformations}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      className={className}
    />
  );
};

export default Image;
