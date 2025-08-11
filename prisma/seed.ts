import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create sample events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "Community Health Camp",
        description:
          "Free health checkup and medical consultation for underprivileged communities",
        date: new Date("2025-08-20"),
        time: "09:00 AM",
        location: "Community Center, Downtown",
        image:
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2940&auto=format&fit=crop",
      },
    }),
    prisma.event.create({
      data: {
        title: "Education Workshop",
        description:
          "Interactive workshop on modern teaching methods for local educators",
        date: new Date("2025-08-25"),
        time: "02:00 PM",
        location: "City Library, Conference Room",
        image:
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2940&auto=format&fit=crop",
      },
    }),
    prisma.event.create({
      data: {
        title: "Food Distribution Drive",
        description: "Monthly food distribution program for families in need",
        date: new Date("2025-08-30"),
        time: "10:00 AM",
        location: "Main Church Hall",
        image:
          "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=3387&auto=format&fit=crop",
      },
    }),
  ]);

  // Create sample blog posts
  const blogs = await Promise.all([
    prisma.blog.create({
      data: {
        title: "Making a Difference: Our First Year Impact",
        excerpt:
          "Reflecting on the incredible journey and the lives we've touched in our first year of operation.",
        category: "Impact",
        content: `This past year has been an incredible journey of growth, learning, and impact. When we started this foundation, we had a simple dream: to make a positive difference in our community. Today, we're proud to share that we've touched over 1,000 lives through our various programs and initiatives.

From health camps that provided medical care to those who couldn't afford it, to educational workshops that empowered local teachers, every step has been meaningful. Our community of volunteers has grown to over 200 dedicated individuals who give their time and energy selflessly.

The road hasn't always been easy, but the smiles on the faces of those we've helped make every challenge worthwhile. As we look to the future, we're excited to expand our reach and deepen our impact.`,
        image:
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2940&auto=format&fit=crop",
      },
    }),
    prisma.blog.create({
      data: {
        title: "Volunteer Spotlight: Meet Sarah",
        excerpt:
          "Get to know one of our most dedicated volunteers and her inspiring journey with our foundation.",
        category: "Volunteers",
        content: `Sarah Johnson has been with us since the very beginning. What started as a weekend volunteering opportunity has transformed into a passionate commitment to our cause.

"I remember my first day clearly," Sarah recalls. "I was nervous, not knowing what to expect. But the moment I saw the gratitude in people's eyes, I knew I had found something special."

Over the past year, Sarah has contributed over 200 hours of service, helping with everything from organizing events to providing one-on-one support to community members. Her dedication has inspired many others to join our volunteer team.

"Volunteering isn't just about giving," Sarah says. "It's about receiving so much more in return - the connections, the learning, and the joy of making a difference."`,
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3387&auto=format&fit=crop",
      },
    }),
    prisma.blog.create({
      data: {
        title: "New Education Center Opening Soon",
        excerpt:
          "Exciting news! We're opening a new education center to serve more children in our community.",
        category: "Education",
        content: `We're thrilled to announce the upcoming opening of our third education center! This new facility will allow us to serve even more children and provide quality education to those who need it most.

The new center, located in the heart of the community, will feature:
- Modern classrooms equipped with the latest learning technology
- A library with over 5,000 books
- Computer lab with high-speed internet
- Outdoor play area for physical activities

"We've seen such a positive impact from our existing centers," says our Education Director. "This new facility will help us reach even more children and provide them with the tools they need to succeed."

The center is scheduled to open in September, and we're currently looking for volunteers and donations to help us furnish and equip the space. If you'd like to contribute, please reach out to our team.`,
        image:
          "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=3431&auto=format&fit=crop",
      },
    }),
  ]);

  console.log("Database seeded successfully!");
  console.log(`Created ${events.length} events and ${blogs.length} blog posts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
