"use client"

import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const destinations = [
    {
      name: "Mecca",
      image: "/kaaba-in-mecca-saudi-arabia-at-sunset.jpg",
      quote:
        "Managing thousands of pilgrims during Hajj season has never been easier. TravelOps streamlines every aspect of our operations.",
      author: "Abdullah Al-Rashid",
      role: "Operations Manager, Al-Haramain Tours",
    },
    {
      name: "Medina",
      image: "/prophets-mosque-medina-saudi-arabia.jpg",
      quote:
        "Our Umrah packages are now fully digitized. From booking to visa processing, everything is automated and efficient.",
      author: "Fatima Hassan",
      role: "Director, Medina Express Travel",
    },
    {
      name: "Rome",
      image: "/st-peters-basilica-vatican-rome-italy.jpg",
      quote:
        "We organize Catholic pilgrimages to Vatican City. TravelOps helps us manage accommodations and itineraries seamlessly.",
      author: "Marco Benedetti",
      role: "CEO, Roma Pilgrim Services",
    },
    {
      name: "Istanbul",
      image: "/blue-mosque-istanbul-turkey-at-golden-hour.jpg",
      quote:
        "Our cultural and historical tours to Turkey have grown 300%. The platform handles everything from payments to customer communications.",
      author: "Ayşe Yılmaz",
      role: "Founder, Bosphorus Heritage Tours",
    },
    {
      name: "Paris",
      image: "/eiffel-tower-paris-france-at-night-illuminated.jpg",
      quote:
        "From romantic getaways to group tours, TravelOps gives us complete control over our European vacation packages.",
      author: "Sophie Dubois",
      role: "Managing Partner, Paris Voyages",
    },
    {
      name: "Jerusalem",
      image: "/dome-of-the-rock-jerusalem-old-city.jpg",
      quote:
        "Coordinating multi-faith pilgrimages to the Holy Land requires precision. This platform delivers exactly that.",
      author: "David Cohen",
      role: "Director, Holy Land Journeys",
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % destinations.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [destinations.length])

  const current = destinations[currentSlide]

  return (
    <div className="min-h-screen flex">
      {/* Left side - Testimonial with slideshow background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2c4f52] to-[#1a2f31] p-12 flex-col justify-between relative overflow-hidden">
        {destinations.map((dest, index) => (
          <div
            key={dest.name}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={dest.image || "/placeholder.svg"}
              alt={dest.name}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-br from-[#2c4f52]/40 to-[#1a2f31]/50" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl">✈️</span>
            </div>
            <span className="text-2xl font-bold text-white">TravelOps</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="text-3xl font-bold text-white leading-relaxed text-balance">
            "{current.quote}"
          </blockquote>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-2xl">👤</div>
            <div>
              <div className="text-white font-semibold">{current.author}</div>
              <div className="text-white/80">{current.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {destinations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-primary" : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
            <span className="ml-3 text-white/80 text-sm font-medium">{current.name}</span>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            <span>Licensed & Accredited</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">🔒</span>
            <span>Bank-Grade Security</span>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  )
}
