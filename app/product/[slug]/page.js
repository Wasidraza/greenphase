import EnquiryForm from "@/app/Components/EnquiryForm";
import Gallery from "@/app/Components/gallery";
import Image from "next/image";
import Link from "next/link";
import products from "@/app/data/product.js";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = products[slug];

  if (!product) {
    return <h1 className="p-10 text-red-600">Product not found</h1>;
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-[300px] w-full max-w-[96%] lg:h-[700px] mx-auto pt-20">
        <Image
          src={product.banner}
          alt={product.title}
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-black/40">
          <h2 className="font-bold">{product.title}</h2>
          <p className="max-w-2xl mt-2 text-sm lg:text-[16px]">{product.description}</p>
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 gap-6 p-10 md:grid-cols-2 lg:grid-cols-4">
        {product.cards.map((card, idx) => (
          <div
            key={idx}
            className="overflow-hidden bg-white shadow-md rounded-2xl group"
          >
            {/* Image container */}
            <div className="relative w-full h-48">
              <Image
                src={card.img}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Card content */}
            <div className="p-6">
              <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
              <p>{card.features}</p>
              <div className="flex items-center justify-end mt-4">
                <Link href={`/product/${slug}/${card.slug}`} className="px-5 py-2 text-white bg-green-500 rounded-lg hover:bg-green-700">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Why Choose Us */}
      <div className="p-10 text-center">
        <h2 className="mb-6 text-3xl font-bold">Why Choose Us</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {product.whyChoose.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-xl"
            >
              <span className="text-4xl">{item.icon}</span>
              <h3 className="mt-2 font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gallry component */}
      <Gallery images={product.gallery} />


      <div className="mt-10 mb-10 text-center">
        <Link
          href="/brochure.pdf"
          download
          className="px-8 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          Download Brochure
        </Link>
      </div>
      <div className="pb-0 mb-0">
        <EnquiryForm />
      </div>
    </div>
  );
}
