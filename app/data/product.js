const products = {
  "smart-home-charger": {
    banner: "/banner1.webp",
    title: "Smart Home Charger",
    description:
      "With Real-time monitoring, Scheduling, Plug in to Charge, Tap & Charge with RFID...",
    price: "₹3,999",
    cards: [
      {
        id: 1,
        title: "Green Phase AC Home Charger",
        features: "7.2 kW / 11 kW / 22 kW",
        dec: "The Green Phase AC Home Charger is designed for residential and semi-commercial use, supporting outputs from 7.2 kW to 22 kW. Compact, safe, and user-friendly, it ensures reliable overnight charging and is ideal for daily EV users.",
        img: "/hc.webp",
        productColor: "red",
        size: "large",
        slug: "hc1",
        priceOptions: {
          "7.2 kW": { price: 25000, mrp: 40000 },
          "11 kW": { price: 32000, mrp: 48000 },
          "22 kW": { price: 45000, mrp: 60000 },
        },
      },
      {
        id: 2,
        title: "Green Phase AC Home Charger",
        features: "7.2 kW / 11 kW / 22 kW",
        dec: "The Green Phase AC Home Charger is designed for residential and semi-commercial use, supporting outputs from 7.2 kW to 22 kW. Compact, safe, and user-friendly, it ensures reliable overnight charging and is ideal for daily EV users.",
        img: "/hc2.webp",
        productColor: "black",
        size: "small",
        slug: "hc2",
        priceOptions: {
          "7.2 kW": { price: 25000, mrp: 40000 },
          "11 kW": { price: 32000, mrp: 48000 },
          "22 kW": { price: 45000, mrp: 60000 },
        },
      },
      {
        id: 3,
        title: "Green Phase AC Home Charger",
        features: "7.2 kW / 11 kW / 22 kW",
        dec: "The Green Phase AC Home Charger is designed for residential and semi-commercial use, supporting outputs from 7.2 kW to 22 kW. Compact, safe, and user-friendly, it ensures reliable overnight charging and is ideal for daily EV users.",
        img: "/h3.webp",
        productColor: "green",
        size: "small",
        slug: "hc3",
        priceOptions: {
          "7.2 kW": { price: 25000, mrp: 40000 },
          "11 kW": { price: 32000, mrp: 48000 },
          "22 kW": { price: 45000, mrp: 60000 },
        },
      },
      {
        id: 4,
        title: "Green Phase AC Home Charger",
        features: "7.2 kW / 11 kW / 22 kW",
        dec: "The Green Phase AC Home Charger is designed for residential and semi-commercial use, supporting outputs from 7.2 kW to 22 kW. Compact, safe, and user-friendly, it ensures reliable overnight charging and is ideal for daily EV users.",
        img: "/h4.webp",
        productColor: "blue",
        size: "small",
        slug: "hc4",
        priceOptions: {
          "7.2 kW": { price: 25000, mrp: 40000 },
          "11 kW": { price: 32000, mrp: 48000 },
          "22 kW": { price: 45000, mrp: 60000 },
        },
      },
      {
        id: 5,
        title: "Green Phase AC Home Charger",
        features: "7.2 kW / 11 kW / 22 kW",
        dec: "The Green Phase AC Home Charger is designed for residential and semi-commercial use, supporting outputs from 7.2 kW to 22 kW. Compact, safe, and user-friendly, it ensures reliable overnight charging and is ideal for daily EV users.",
        img: "/hc5.webp",
        productColor: "yellow",
        size: "small",
        slug: "hc5",
        priceOptions: {
          "7.2 kW": { price: 25000, mrp: 40000 },
          "11 kW": { price: 32000, mrp: 48000 },
          "22 kW": { price: 45000, mrp: 60000 },
        },
      },
       {
        id: 6,
        title: "Green Phase AC Home Charger",
        features: "7.2 kW / 11 kW / 22 kW",
        dec: "The Green Phase AC Home Charger is designed for residential and semi-commercial use, supporting outputs from 7.2 kW to 22 kW. Compact, safe, and user-friendly, it ensures reliable overnight charging and is ideal for daily EV users.",
        img: "/charger.jpeg",
        productColor: "yellow",
        size: "small",
        slug: "hc6",
        priceOptions: {
          "7.2 kW": { price: 25000, mrp: 40000 },
          "11 kW": { price: 32000, mrp: 48000 },
          "22 kW": { price: 45000, mrp: 60000 },
        },
      },
    ],

    // Why Choose Section
    whyChoose: [
      { icon: "⚡", desc: "Fast charging up to 22kW" },
      { icon: "🔒", desc: "Safe with RFID authentication" },
      { icon: "🌍", desc: "Eco-friendly energy usage" },
      { icon: "📱", desc: "10 days replacement" },
      { icon: "🔧", desc: "Installation Available" },
      { icon: "📦", desc: "Free delivery" },
      { icon: "🛡️", desc: "2 Year warranty" },
      { icon: "🔌", desc: " Compatible with all EV models" },
    ],

    // Gallery Images
    gallery: [
      "/gallery/2.webp",
      "/gallery/3.webp",
      "/gallery/5.webp",
      "/gallery/6.webp",
    ],

    // Key Features
    keyFeatures: [
      "Power Options: 7.2 kW / 11 kW / 22 kW",
      "Compact & Stylish Wall-Mount Design",
      "Smart App Integration (Wi-Fi / Bluetooth)",
      "RFID & Mobile App Authentication",
      "Energy Efficient & BIS Certified",
      "Overcurrent, Surge & Short-Circuit Protection",
      "LED Indicators for Charging Status",
    ],

    // Technical Specifications
    specifications: {
      "Output Power": "7.2 kW / 11 kW / 22 kW",
      "Input Voltage": "230V (Single Phase) / 400V (Three Phase)",
      "Current Rating": "32A",
      "Connector Type": "Type 2 (IEC 62196)",
      Connectivity: "Wi-Fi / Bluetooth / OCPP",
      Enclosure: "IP54 Weather-Proof",
      Installation: "Wall-Mount / Pole-Mount",
    },

    // Applications
    applications: [
      "Residential Homes – Daily Overnight Charging",
      "Apartments & Housing Societies",
      "Workplace & Semi-Commercial Spaces",
    ],

    // Warranty & Support
    warranty: [
      "2 Years Comprehensive Warranty",
      "24x7 Customer Support",
      "Installation & After-Sales Service",
    ],
  },
  "smart-dc-charger": {
    banner: "/banner2.webp",
    title: "Green Phase DC Fast Charger",
    description: "High power DC fast charging with real-time monitoring...",
    cards: [
      {
        title: "Green Phase DC Fast Charger",
        features: " 30 kW , 60 KW, 120 kW",
        dec: "The Green Phase DC Fast Charger is a high-powered, future-ready solution designed for public charging stations, fleet operators, and highway installations. It delivers ultra-fast charging within minutes and ensures a smart, connected experience through OCPP cloud integration.",
        img: "/dc.webp",
        size: "large",
        slug: "DC1",
        // ✅ priceOptions add kiya
        priceOptions: {
          "30 kW": null,
          "60 kW": null,
          "120 kW": null,
        },
      },
      {
        title: "Green Phase DC Fast Charger",
        dec: "The Green Phase DC Fast Charger is a high-powered, future-ready solution designed for public charging stations, fleet operators, and highway installations. It delivers ultra-fast charging within minutes and ensures a smart, connected experience through OCPP cloud integration.",
        features: " 30 kW , 60 KW, 120 kW",
        img: "/dc1.webp",
        size: "small",
        slug: "DC2",
        // ✅ priceOptions add kiya
        priceOptions: {
          "30 kW": null,
          "60 kW": null,
          "120 kW": null,
        },
      },
      {
        title: "Green Phase DC Fast Charger",
        dec: "The Green Phase DC Fast Charger is a high-powered, future-ready solution designed for public charging stations, fleet operators, and highway installations. It delivers ultra-fast charging within minutes and ensures a smart, connected experience through OCPP cloud integration.",
        features: " 30 kW , 60 KW, 120 kW",
        img: "/dc2.webp",
        size: "small",
        slug: "DC3",
        // ✅ priceOptions add kiya
        priceOptions: {
          "30 kW": null,
          "60 kW": null,
          "120 kW": null,
        },
      },
    ],

    // Why Choose Section
    whyChoose: [
      { icon: "⚡", title: "High Speed", desc: "Fast charging up to 22kW" },
      { icon: "🔒", title: "Secure", desc: "Safe with RFID authentication" },
      { icon: "🌍", title: "Eco", desc: "Eco-friendly energy usage" },
      { icon: "📱", title: "App Control", desc: "Control via mobile app" },
    ],

    // Gallery Images
    gallery: ["/dc.webp", "/dc2.webp", "/dc1.webp", "/dc.webp"],

    // Key Features
    keyFeatures: [
      "Ultra-Fast Charging: 30 kW to 120 kW",
      "Dual Gun Support: CCS2 / CHAdeMO / GB/T",
      "Smart Payment: RFID, UPI, Mobile App",
      "Cloud Connectivity: OCPP 1.6 / 2.0 support",
      "Safety Certified: Overload, Surge & Temperature Protection",
      "Rugged Outdoor Design: IP54 / IP65 enclosure",
      "User-Friendly 7” or 10” Touchscreen Interface",
    ],

    // Technical Specifications
    specifications: {
      "Output Power": "30 kW / 60 kW / 120 kW (configurable)",
      "Input Voltage": "200V – 1000V DC",
      "Efficiency:": "≥ 95%",
      "Connector Types": "CCS2 / CHAdeMO / GB/T",
      "Cooling System": "3 Phase, 400V AC",
      " Display": " 7” / 10” Touchscreen",
      Communication: "Ethernet / 4G / Wi-Fi / OCPP",
    },

    // Applications
    applications: [
      "Public Charging Stations: Highways, Metro Cities, Parking Hubs",
      "Fleet Operators: Electric Buses, Taxis, Logistics EVs",
      "Commercial Spaces: Malls, Offices, Industrial Parks",
    ],

    // Warranty & Support
    warranty: [
      "2 Years Comprehensive Warranty",
      "24x7 Customer Support",
      "On-Site Service & Remote Monitoring",
    ],
  },
};

export default products;
