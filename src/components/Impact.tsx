import { Heart, Users, Globe } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Lives Impacted",
    description: "People helped through our programs"
  },
  {
    icon: Globe,
    value: "25+",
    label: "Countries Reached",
    description: "Global impact across continents"
  },
  {
    icon: Heart,
    value: "1M+",
    label: "Donations Received",
    description: "From generous supporters like you"
  }
]

export function Impact() {
  return (
    <section className="bg-secondary py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-3xl font-bold">Our Impact</h2>
        
        <div className="grid grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="flex flex-col items-center rounded-lg bg-white p-8 text-center shadow-lg"
            >
              <stat.icon className="mb-4 h-12 w-12 text-primary" />
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
