import { Hero } from "@/components/Hero"
import { Impact } from "@/components/Impact"
import { Events } from "@/components/Events"
import { Volunteer } from "@/components/Volunteer"
import { Blog } from "@/components/Blog"
import { Testimonials } from "@/components/Testimonials"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Impact />
      <Events />
      <Volunteer />
      <Testimonials />
      <Blog />
    </>
  )
}
