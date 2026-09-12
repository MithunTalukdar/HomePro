export interface Technician {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  experience: string;
  jobsCompleted: number;
  availability: 'Available Now' | 'Available Today' | 'Booked';
  skills: string[];
  imageUrl: string;
  bio: string;
  verified: boolean;
  serviceAreas: string[];
  estimatedArrival: string;
  languages: string[];
}

export const technicians: Technician[] = [
  {
    id: 't1',
    name: 'Marcus Johnson',
    role: 'Master Electrician',
    rating: 4.9,
    reviews: 128,
    experience: '12 Years',
    jobsCompleted: 1450,
    availability: 'Available Now',
    skills: ['Wiring', 'Panel Upgrades', 'Smart Home', 'Troubleshooting', 'Fan Repair'],
    imageUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=800',
    bio: 'Marcus is a licensed master electrician with over a decade of experience in both residential and commercial electrical systems. Specializes in modern smart home integrations and complex troubleshooting.',
    verified: true,
    serviceAreas: ['Downtown', 'Westside', 'North Hills'],
    estimatedArrival: '30-45 mins',
    languages: ['English', 'Spanish']
  },
  {
    id: 't2',
    name: 'Sarah Chen',
    role: 'HVAC Specialist',
    rating: 4.8,
    reviews: 94,
    experience: '8 Years',
    jobsCompleted: 890,
    availability: 'Available Today',
    skills: ['AC Repair', 'Heating Systems', 'Air Quality', 'Maintenance', 'AC Installation', 'AC Service'],
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    bio: 'Sarah brings top-tier expertise to climate control systems. She is EPA certified and known for her prompt, efficient service in restoring comfort to homes during extreme weather conditions.',
    verified: true,
    serviceAreas: ['Eastside', 'South Park', 'Downtown'],
    estimatedArrival: '2-3 hours',
    languages: ['English', 'Mandarin']
  },
  {
    id: 't3',
    name: 'David Rodriguez',
    role: 'Expert Plumber',
    rating: 5.0,
    reviews: 215,
    experience: '15 Years',
    jobsCompleted: 2300,
    availability: 'Booked',
    skills: ['Pipe Repair', 'Water Heaters', 'Drain Cleaning', 'Installations'],
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800',
    bio: 'A second-generation plumber, David has seen and fixed it all. His meticulous attention to detail and commitment to long-lasting solutions makes him one of our most requested technicians.',
    verified: true,
    serviceAreas: ['All Metro Areas'],
    estimatedArrival: 'Tomorrow',
    languages: ['English']
  }
];

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  desc: string;
  longDescription: string;
  image: string;
}

export const categories: Category[] = [
  { id: 'c1', slug: 'electrical', name: 'Electrical', icon: 'Zap', desc: 'Wiring, panels, appliances', longDescription: 'Professional electricians for repair, installation, wiring, inspections and more.', image: '/images/services/professional-electrician.jpg' },
  { id: 'c2', slug: 'ac-service', name: 'AC Service', icon: 'Wind', desc: 'Repair, install, maintenance', longDescription: 'Expert AC servicing, repair, and installation for all brands and types of air conditioners.', image: '/images/services/ac-repair.jpg' },
  { id: 'c3', slug: 'plumbing', name: 'Plumbing', icon: 'Droplets', desc: 'Leaks, drains, pipes', longDescription: 'Reliable plumbing services for leaks, pipe repairs, bathroom fittings, and drain cleaning.', image: '/images/services/plumbing.jpg' },
  { id: 'c4', slug: 'appliance-repair', name: 'Appliance Repair', icon: 'Wrench', desc: 'Washing machines, fridges', longDescription: 'Certified technicians to repair washing machines, refrigerators, microwaves, and more.', image: '/images/services/appliance-repair.jpg' },
  { id: 'c5', slug: 'cctv', name: 'CCTV', icon: 'Camera', desc: 'Security, surveillance', longDescription: 'Complete CCTV installation, maintenance, and repair services for home and office security.', image: '/images/services/cctv-installation.jpg' },
  { id: 'c6', slug: 'ro-water', name: 'RO / Water', icon: 'Droplet', desc: 'Purifier installation, repair', longDescription: 'RO and water purifier installation, filter replacement, and maintenance services.', image: '/images/services/ro-water-service.jpg' },
  { id: 'c7', slug: 'cleaning', name: 'Cleaning', icon: 'Sparkles', desc: 'Deep clean, standard clean', longDescription: 'Professional deep cleaning services for homes, bathrooms, kitchens, and sofas.', image: '/images/services/home-cleaning.jpg' },
  { id: 'c8', slug: 'installation', name: 'Installation', icon: 'Tool', desc: 'TV mounting, furniture', longDescription: 'Handyman services for TV wall mounting, furniture assembly, and shelf installations.', image: '/images/services/installation.jpg' },
];

export interface DetailedService {
  id: string;
  slug: string;
  categoryId: string;
  categorySlug: string;
  name: string;
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  included: string[];
  notIncluded: string[];
  warranty: string;
  faqs: { q: string; a: string }[];
}


const generateServices = (): DetailedService[] => {
  const result: DetailedService[] = [];
  let idCounter = 1;

  const pushService = (catId: string, catSlug: string, name: string, price: string, duration: string, defaultImage: string, desc: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    

    const uniqueImagePath = `/images/services/${slug}.jpg`;
    
    result.push({
      id: `ps${idCounter++}`,
      slug,
      categoryId: catId,
      categorySlug: catSlug,
      name,
      price,
      duration,
      rating: 4.8 + (Math.random() * 0.2),
      reviews: Math.floor(Math.random() * 500) + 50,
      image: uniqueImagePath,
      description: desc,
      included: ['Professional service delivery', 'Basic cleanup after service', 'Standard tools and equipment'],
      notIncluded: ['Cost of spare parts (if required)', 'Major structural changes'],
      warranty: '30 Days on Service',
      faqs: [{ q: 'Is there a warranty?', a: 'Yes, we provide a 30-day service warranty.' }]
    });
  };


  const electricalServices = ['Fan Repair', 'Ceiling Fan Installation', 'Switch and Socket Repair', 'Electrical Wiring', 'MCB Repair', 'Electrical Inspection', 'Light Installation', 'Power Failure Repair', 'Inverter Installation', 'Doorbell Installation'];
  electricalServices.forEach(s => pushService('c1', 'electrical', s, '₹' + (Math.floor(Math.random() * 500) + 149), '45 mins', 'placeholder', `Professional ${s} by verified experts.`));


  const acServices = ['AC General Service', 'AC Deep Cleaning', 'AC Repair', 'AC Installation', 'AC Uninstallation', 'AC Gas Refill', 'AC Water Leakage Repair', 'AC Cooling Problem Repair', 'AC Annual Maintenance'];
  acServices.forEach(s => pushService('c2', 'ac-service', s, '₹' + (Math.floor(Math.random() * 1000) + 499), '1 hr', 'placeholder', `Top rated ${s} to ensure efficient cooling.`));


  const plumbingServices = ['Tap Repair', 'Pipe Leakage Repair', 'Drain Cleaning', 'Bathroom Fitting', 'Toilet Repair', 'Water Tank Cleaning', 'Sink Repair', 'Shower Installation', 'Water Pipeline Installation'];
  plumbingServices.forEach(s => pushService('c3', 'plumbing', s, '₹' + (Math.floor(Math.random() * 400) + 149), '1 hr', 'placeholder', `Reliable ${s} to fix all your plumbing issues.`));


  const applianceServices = ['Washing Machine Repair', 'Refrigerator Repair', 'Microwave Repair', 'Geyser Repair', 'Chimney Repair', 'Water Heater Repair', 'Dishwasher Repair'];
  applianceServices.forEach(s => pushService('c4', 'appliance-repair', s, '₹' + (Math.floor(Math.random() * 500) + 299), '1.5 hrs', 'placeholder', `Expert ${s} right at your doorstep.`));


  const cctvServices = ['CCTV Installation', 'CCTV Camera Repair', 'CCTV Maintenance', 'DVR / NVR Setup', 'CCTV System Inspection', 'Home Security Setup'];
  cctvServices.forEach(s => pushService('c5', 'cctv', s, '₹' + (Math.floor(Math.random() * 1000) + 499), '2 hrs', 'placeholder', `Secure your premises with our ${s}.`));


  const roServices = ['RO Installation', 'RO Repair', 'RO Filter Replacement', 'Water Purifier Service', 'Water Purifier Maintenance', 'Water Quality Check'];
  roServices.forEach(s => pushService('c6', 'ro-water', s, '₹' + (Math.floor(Math.random() * 300) + 199), '45 mins', 'placeholder', `Ensure clean drinking water with ${s}.`));


  const cleaningServices = ['Home Deep Cleaning', 'Bathroom Cleaning', 'Kitchen Cleaning', 'Sofa Cleaning', 'Carpet Cleaning', 'Office Cleaning', 'Move-in / Move-out Cleaning'];
  cleaningServices.forEach(s => pushService('c7', 'cleaning', s, '₹' + (Math.floor(Math.random() * 2000) + 499), '3 hrs', 'placeholder', `Spotless and hygienic ${s} by professionals.`));


  const installationServices = ['TV Wall Mounting', 'Furniture Assembly', 'Curtain Installation', 'Wall Shelf Installation', 'Mirror Installation', 'Smart Device Installation', 'Appliance Installation'];
  installationServices.forEach(s => pushService('c8', 'installation', s, '₹' + (Math.floor(Math.random() * 300) + 199), '1 hr', 'placeholder', `Hassle-free ${s} for your home or office.`));

  return result;
};

export const services: DetailedService[] = generateServices();

export const testimonials = [
  {
    id: 'ts1',
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'Incredible service! The technician arrived within 30 minutes and fixed our AC right before the summer heat peaked.',
    date: '2 days ago'
  },
  {
    id: 'ts2',
    name: 'Rahul Verma',
    location: 'Delhi',
    rating: 5,
    text: 'Very professional electrical inspection. Marcus explained everything clearly and the pricing was completely transparent.',
    date: '1 week ago'
  },
  {
    id: 'ts3',
    name: 'Anita Desai',
    location: 'Bangalore',
    rating: 4,
    text: 'Booking was incredibly smooth. Loved the estimated arrival time feature. The repair itself was flawless.',
    date: '2 weeks ago'
  }
];

export const userProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+91 98765 43210',
  photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
};

export const savedAddresses = [
  {
    id: 'a1',
    label: 'Home',
    address: 'A-402, Skyline Apartments, MG Road',
    city: 'Bangalore',
    pincode: '560001',
    isDefault: true
  },
  {
    id: 'a2',
    label: 'Office',
    address: 'Tech Park, Tower B, 4th Floor',
    city: 'Bangalore',
    pincode: '560045',
    isDefault: false
  }
];

export const bookingHistory = [
  {
    id: 'BK-98432',
    serviceId: 'ps1',
    serviceName: 'Fan Repair',
    technicianName: 'Marcus Johnson',
    date: 'Oct 12, 2023',
    price: '₹198',
    status: 'Completed'
  },
  {
    id: 'BK-98455',
    serviceId: 'ps4',
    serviceName: 'AC Service',
    technicianName: 'Sarah Chen',
    date: 'Nov 05, 2023',
    price: '₹548',
    status: 'Completed'
  },
  {
    id: 'BK-98712',
    serviceId: 'ps2',
    serviceName: 'Switch Repair',
    technicianName: 'Auto Assigned',
    date: 'Dec 10, 2023',
    price: '₹148',
    status: 'Cancelled'
  }
];

export const notifications = [
  {
    id: 'n1',
    title: 'Booking Confirmed',
    message: 'Your booking BK-10293 for AC Service has been confirmed.',
    time: '2 hours ago',
    read: false,
    type: 'booking'
  },
  {
    id: 'n2',
    title: 'Technician Assigned',
    message: 'Sarah Chen has been assigned to your AC Service booking.',
    time: '1 hour ago',
    read: false,
    type: 'booking'
  },
  {
    id: 'n3',
    title: 'Welcome to HomePro!',
    message: 'Get 20% off on your first booking using code WELCOME20.',
    time: '2 days ago',
    read: true,
    type: 'system'
  }
];