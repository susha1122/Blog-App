import React from 'react'
import { IKImage } from 'imagekitio-react';


const Image = ({src, className, w, h, alt, isFullUrl}) => {
  return (
    <IKImage 
    urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT} 
    {...(isFullUrl 
        ? { src }        // for full URLs
        : { path: src }  // for paths
    )}
    alt={alt} 
    className={className}
    loading="lazy"
    lqip = {{ active: true, quality: 20 }} 
    width={w}
    height={h}
    transformation={[
      {
        width: w,
        height: h,
      }
    ]}
    />
  )
}

export default Image