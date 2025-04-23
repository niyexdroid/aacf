import { Heart, Users, Globe, HandHeart, School, Sprout } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Lives Impacted",
    description: "People helped through our programs and initiatives worldwide"
  },
  {
    icon: Globe,
    value: "25+",
    label: "Countries Reached",
    description: "Making a difference across continents through sustainable programs"
  },
  {
    icon: Heart,
    value: "1M+",
    label: "Donations Received",
    description: "Generous contributions from supporters enabling our mission"
  },
  {
    icon: HandHeart,
    value: "5K+",
    label: "Active Volunteers",
    description: "Dedicated individuals giving their time to make a difference"
  },
  {
    icon: School,
    value: "100+",
    label: "Education Centers",
    description: "Learning facilities providing quality education to communities"
  },
  {
    icon: Sprout,
    value: "200+",
    label: "Community Projects",
    description: "Sustainable initiatives creating lasting positive change"
  }
]

export function Impact() {
  return (
    <section className="bg-secondary py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-3xl font-bold">Our Impact</h2>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group flex cursor-pointer flex-col items-center rounded-lg bg-white p-8 text-center shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              <stat.icon className="mb-4 h-12 w-12 text-[#ff6b00] transition-transform group-hover:scale-110" />
              <div className="mb-2 text-4xl font-bold text-primary">{stat.value}</div>
              <div className="mb-2 font-medium">{stat.label}</div>
              <p className="text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
