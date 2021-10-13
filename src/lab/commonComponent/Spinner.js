import React from 'react';
import Loader from "react-loader-spinner";

const Spinner = ({showLoader, width, height}) => {
    const renderer = () => {
      if (showLoader) {
        return <Loader
            type="Oval"
            color="#28A3DA"
            height={width || 80}
            width={height || 80}
        />
      } else {
        return null;
      }
    };

    return (
      <>
          {renderer()}
      </>
    );
  };

export default Spinner;
