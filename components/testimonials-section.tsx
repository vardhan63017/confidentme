"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    avatar: "/professional-asian-woman-headshot-smiling.jpg",
    content:
      "ConfidentMe transformed my interview preparation. The real-time feedback on my body language helped me identify nervous habits I never knew I had. Landed my dream job!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "MBA Graduate",
    avatar: "/professional-black-man-headshot-smiling.jpg",
    content:
      "As an MBA student, I practiced countless interviews. This platform's AI feedback was more insightful than any mock interview with peers. The confidence meter is a game-changer.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager at Meta",
    avatar: "/professional-latina-woman-headshot-smiling.jpg",
    content:
      "The resume-based questions feature is incredible. It prepared me for exactly the types of questions I faced in my actual interviews. Highly recommend for any job seeker!",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref)

  return (
    <section id="testimonials" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-light text-accent font-medium text-sm mb-6">
            Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-4 text-balance">
            Trusted by <span className="text-primary">students & job seekers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who have improved their interview skills and landed their dream jobs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`bg-card rounded-2xl p-8 shadow-lg border border-border relative ${
                isInView ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed">{`"${testimonial.content}"`}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
