import Image from "next/image";
import starSvg from "@/public/assets/icons/star.svg";

export default function Testimonial({
  quote,
  author,
  occupation,
}: {
  quote: string;
  author: string;
  occupation: string;
}) {
  return (
    <div className="z-10 relative lg:mt-4 lg:mb-16">
      <blockquote className="auth-blockquote font-geist font-sans text-justify">
        {quote}
      </blockquote>
      <div className="flex items-center justify-between">
        <div>
          <cite className="auth-testimonial-author">{`- ${author}.`}</cite>
          <p className="max-md:text-xs text-gray-500">{occupation}</p>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Image
              src={starSvg}
              alt="Star"
              key={star}
              width={20}
              height={20}
              className="w-5 h-5"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
