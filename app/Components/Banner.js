const { default: Link } = require("next/link");
import React from "react";

function Banner() {
  return (
    <>
      {/* CTA */}
      <div className="flex flex-col items-center gap-4 px-5 mx-auto mt-12 mb-5 bg-green-600 max-w-[90%] py-14 sm:flex-row rounded-2xl sm:justify-between">
        <div className="text-center sm:text-left">
          <h4 className="text-xl font-semibold text-white lg:text-3xl">
            Ready to switch to smart charging?
          </h4>
          <p className="mt-1 text-[16px] text-gray-100">
            Get a free site assessment and custom pricing for your location.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center px-5 py-3 text-sm font-medium text-white bg-black rounded-lg"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}

export default Banner;
