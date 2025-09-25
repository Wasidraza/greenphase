import React from "react";
import WeServe from "../Components/WeServe";
import Mission from "../Components/Mission";
import Banner from "../Components/Banner";
import Navbar from "../Components/Navbar";
import Footer from "../Components/footer";

function about() {
  return (
    <>
    <Navbar/>
      {/* About Us Section */}
      <section className="pt-10 bg-white">
        <div className="flex flex-col-reverse items-center justify-between gap-12 px-6 py-16 mx-auto lg:px-20 lg:flex-row">
          <div className="flex-1">
            <h1 className="pb-4 text-2xl leading-tight text-center">
              ABOUT US
            </h1>
            <p className="mb-2 text-lg text-gray-600">
              At Green Phase, we believe the future of mobility is electric, and
              we are committed to powering that future with world-class EV
              charging solutions. Founded with a vision to make clean mobility
              accessible and reliable, Green Phase is a homegrown Indian company
              dedicated to designing, manufacturing, and delivering cutting-edge
              EV chargers that meet global standards.
            </p>
            <p className="mb-2 text-lg text-gray-600">
              Every Green Phase charger is proudly Made in India, ensuring not
              only superior quality control but also faster service and cost
              efficiency for our customers. Our chargers are built with advanced
              safety features, smart connectivity, and user-friendly designs
              that make EV charging simple, efficient, and reliable. From
              compact home charging solutions to high-capacity public and
              commercial charging stations, we offer a complete range of
              products to meet the diverse needs of EV users, businesses, and
              infrastructure developers.
            </p>
            <p className="mb-2 text-lg text-gray-600">
              What sets Green Phase apart is our blend of innovation, design,
              and sustainability. Inspired by futuristic technology and modern
              aesthetics, our chargers are not just functional equipment but
              also reflect the new era of clean mobility. By integrating
              intelligent software, seamless payment systems, and remote
              monitoring capabilities, we ensure that charging an EV is as easy
              as charging a phone.
            </p>
          </div>
        </div>
      </section>

      <WeServe/>
      <Mission/>
      <Banner/>
      <Footer/>
    </>
  );
}

export default about;
export const metadata = {
  title: "About | Green Phase",
  description: "green phase about page",
};
