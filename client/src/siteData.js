export const siteContent = {
  businessName: "Pragathi's Wellness Centre",
  businessSubtitle: "Yoga & holistic wellness care",
  phone: "8143503689",
  email: "pragathiwellnesscentre@gmail.com",
  instagramUrl: "https://www.instagram.com/pragathis_wellness?igsh=MmYxOHYwNzNuam9u&utm_source=qr",
  instagramHandle: "@pragathis_wellness",
  directionsUrl: "https://share.google/wjjCBEaPspxz7YPxV",
  logoSrc: "/assets/logo.jpg",
  publicSiteUrl: import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin,
  ogImage:
    import.meta.env.VITE_PUBLIC_OG_IMAGE ||
    `${window.location.origin}/assets/logo.jpg`,
  businessDisplayAddress:
    import.meta.env.VITE_BUSINESS_DISPLAY_ADDRESS ||
    "Pragatinagar, Hyderabad, Telangana",
  businessStreetAddress:
    import.meta.env.VITE_BUSINESS_STREET_ADDRESS ||
    "Pragatinagar, Hyderabad, Telangana",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
  services: [
    {
      key: "yoga",
      name: "Yoga",
      description:
        "Guided yoga sessions to improve flexibility, posture, strength, and inner calm through mindful movement and breath.",
    },
    {
      key: "acupuncture",
      name: "Acupuncture",
      description:
        "A focused therapy approach that supports pain relief, energy balance, and overall wellness with gentle precision.",
    },
    {
      key: "ayurveda",
      name: "Ayurveda",
      description:
        "Traditional wellness guidance rooted in natural healing practices that encourage balance, vitality, and preventive care.",
    },
    {
      key: "homeopathy",
      name: "Homeopathy",
      description:
        "A gentle, individualized wellness method that supports the body's natural response and long-term health goals.",
    },
    {
      key: "chiropractic",
      name: "Chiropractic",
      description:
        "Supportive care aimed at posture, alignment, and mobility to help your body move with more ease and comfort.",
    },
    {
      key: "cupping",
      name: "Cupping Therapy",
      description:
        "An age-old therapy often chosen for muscle tension, circulation support, and a feeling of physical release.",
    },
    {
      key: "bungee",
      name: "Bungee Fitness",
      description:
        "A dynamic workout experience that blends fun, low-impact movement, and core strength in an uplifting format.",
    },
    {
      key: "massage",
      name: "Massage",
      description:
        "Relaxing and restorative bodywork that helps ease stress, reduce tension, and support physical recovery.",
    },
  ],
  trustPoints: [
    {
      title: "Holistic wellness approach",
      body:
        "We look beyond one symptom and support overall well-being through movement, therapy, and natural healing practices.",
    },
    {
      title: "Personalized attention",
      body:
        "Every person is different, so our centre is designed to offer care that feels considerate, flexible, and personal.",
    },
    {
      title: "Multiple therapies in one place",
      body:
        "From yoga to acupuncture, ayurveda, chiropractic, and massage, you can explore complementary wellness options together.",
    },
    {
      title: "Calm and supportive environment",
      body:
        "Our setting is created to feel welcoming and restful, making it easier to slow down and focus on healing.",
    },
    {
      title: "Natural healing and lifestyle support",
      body:
        "We value sustainable wellness habits that help clients feel better not just today, but in daily life over time.",
    },
    {
      title: "Convenient local access",
      body:
        "Located for the Pragatinagar community, we aim to make quality wellness support easier to reach and return to regularly.",
    },
  ],
  businessHours: [
    { label: "Monday - Friday", value: "7:00 AM - 8:00 PM" },
    { label: "Saturday", value: "7:00 AM - 6:00 PM" },
    { label: "Sunday", value: "By appointment" },
  ],
};
