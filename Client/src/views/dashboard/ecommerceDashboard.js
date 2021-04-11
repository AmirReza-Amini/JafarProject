import React, { useEffect, Fragment } from "react";
import { Slide } from "react-slideshow-image";
import { Link } from "react-router-dom";
import "react-slideshow-image/dist/styles.css";
import ImgSrc1 from "../../assets/img/slider/1.jpg";
// Styling

const EcommerceDashboard = () => {
  const slideImages = [
    require("../../assets/img/slider/1.jpg"),
    require("../../assets/img/slider/2.jpg"),
    require("../../assets/img/slider/3.jpg"),
    require("../../assets/img/slider/4.jpg"),
    require("../../assets/img/slider/5.jpg"),
    
   ];
  useEffect(() => {
    //console.log("from use effect", slideImages[0].default);
  }, []);

  return (
    <div className="slide-container" style = {{padding: '20px'}}>
      <Slide>
         {slideImages.map(item => 
            <div className="each-slide" key={item}>
            <div style={{ backgroundImage: `url(${item.default})`}}>
             
            </div>
          </div>
            )}
        {/* <div className="each-slide">
          <div style={{ backgroundImage: `url(${slideImages[0].default})`}}>
           
          </div>
        </div>
        <div className="each-slide">
          <div style={{ backgroundImage: `url(${slideImages[1].default})` }}>
            
          </div>
        </div>
        <div className="each-slide">
          <div style={{ backgroundImage: `url(${slideImages[2].default})` }}>
            
          </div>
        </div>
        <div className="each-slide">
          <div style={{ backgroundImage: `url(${slideImages[3].default})` }}>
            
          </div>
        </div>
        <div className="each-slide">
          <div style={{ backgroundImage: `url(${slideImages[4].default})` }}>
            
          </div>
        </div> */}
      </Slide>
    </div>
    
  );
};

export default EcommerceDashboard;
