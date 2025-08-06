"use client";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Durojaiye Omolara",
      role: "Founder & CEO",
      image:
        "https://ik.imagekit.io/niyexdroid/girl-2.jpg?updatedAt=1754312714880",
    },
    {
      name: "Adegbola Adeniyi",
      role: "Administrator & Secretary",
      image:
        "https://ik.imagekit.io/niyexdroid/boy-2.jpg?updatedAt=1754312926621",
    },
    {
      name: "Aina Oluwakemi",
      role: "Financial Officer",
      image:
        "https://ik.imagekit.io/niyexdroid/girl-1.jpg?updatedAt=1754312714735",
    },
    {
      name: "Adeyanju Shalewa",
      role: "Program Coordinator",
      image:
        "https://ik.imagekit.io/niyexdroid/girl-3.jpg?updatedAt=1754312714713",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0">
          <img
            src="https://ik.imagekit.io/niyexdroid/bg-1.jpg?updatedAt=1754320829824"
            alt="Children being helped"
            className="h-full w-full object-cover opacity-40"
          />
        </div>
        <div className="container relative mx-auto px-4 py-32">
          <h1 className="mb-6 text-5xl font-bold">About Our Mission</h1>
          <p className="max-w-2xl text-xl">
            Dedicated to creating positive change through sustainable community
            development and child welfare programs across Africa.
          </p>
        </div>
      </section>

      {/* Foundation Info Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-800">
                Our Story
              </h2>
              <p className="mb-4 text-gray-600">
                Founded in 2015, African Child Care Foundation has been at the
                forefront of supporting underprivileged children across African
                communities. Our journey began with a simple mission: to ensure
                every child has access to basic necessities and quality
                education.
              </p>
              <p className="text-gray-600">
                Today, we've impacted over 10,000 lives through our various
                programs and initiatives, working closely with local communities
                to create sustainable change.
              </p>
            </div>
            <div>
              <div className="rounded-lg bg-white p-8 shadow-lg">
                <h3 className="mb-4 text-2xl font-bold text-gray-800">
                  Our Impact
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-orange-500">
                      1k+
                    </span>
                    <span className="text-gray-600">Children Helped</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-orange-500">
                      7+
                    </span>
                    <span className="text-gray-600">Communities</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-orange-500">
                      4+
                    </span>
                    <span className="text-gray-600">Programs</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-orange-500">
                      2
                    </span>
                    <span className="text-gray-600">Countries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Existing Team Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Our Minds</h2>
          <p className="mt-4 text-gray-600">
            {" "}
            <em>
              To restore dignity and hope to vulnerable populations—especially
              the elderly, children, pregnant women, and orphans, by providing
              essential support in health, education, and daily living. We are
              committed to delivering relief, nurturing well-being, and building
              a compassionate community where no one is left behind.
            </em>
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-64 w-full object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
