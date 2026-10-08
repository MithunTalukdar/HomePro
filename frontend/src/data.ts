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
  specialty?: string;
  hourlyRate?: string;
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
    serviceAreas: ['Downtown', 'Westside', 'North Hills', 'Salt Lake', 'Indiranagar'],
    estimatedArrival: '30-45 mins',
    languages: ['English', 'Hindi']
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
    serviceAreas: ['Eastside', 'South Park', 'Downtown', 'Koramangala', 'New Town'],
    estimatedArrival: '2-3 hours',
    languages: ['English', 'Hindi']
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
    languages: ['English', 'Hindi']
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
  { id: 'c1', slug: 'electrical', name: 'Electrical', icon: 'Zap', desc: 'Wiring, panels, appliances', longDescription: 'Professional electricians for repair, installation, wiring, inspections and more.', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800' },
  { id: 'c2', slug: 'ac-service', name: 'AC Service', icon: 'Wind', desc: 'Repair, install, maintenance', longDescription: 'Expert AC servicing, repair, and installation for all brands and types of air conditioners.', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800' },
  { id: 'c3', slug: 'plumbing', name: 'Plumbing', icon: 'Droplets', desc: 'Leaks, drains, pipes', longDescription: 'Reliable plumbing services for leaks, pipe repairs, bathroom fittings, and drain cleaning.', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' },
  { id: 'c4', slug: 'appliance-repair', name: 'Appliance Repair', icon: 'Wrench', desc: 'Washing machines, fridges', longDescription: 'Certified technicians to repair washing machines, refrigerators, microwaves, and more.', image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800' },
  { id: 'c5', slug: 'cctv', name: 'CCTV', icon: 'Camera', desc: 'Security, surveillance', longDescription: 'Complete CCTV installation, maintenance, and repair services for home and office security.', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800' },
  { id: 'c6', slug: 'ro-water', name: 'RO / Water', icon: 'Droplet', desc: 'Purifier installation, repair', longDescription: 'RO and water purifier installation, filter replacement, and maintenance services.', image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&q=80&w=800' },
  { id: 'c7', slug: 'cleaning', name: 'Cleaning', icon: 'Sparkles', desc: 'Deep clean, standard clean', longDescription: 'Professional deep cleaning services for homes, bathrooms, kitchens, and sofas.', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800' },
  { id: 'c8', slug: 'installation', name: 'Installation', icon: 'Tool', desc: 'TV mounting, furniture', longDescription: 'Handyman services for TV wall mounting, furniture assembly, and shelf installations.', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800' },
];

export const SERVICE_IMAGE_MAP: Record<string, string> = {
  // 1. Electrical
  'fan-repair': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
  'ceiling-fan-installation': 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&q=80&w=800',
  'switch-and-socket-repair': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
  'electrical-wiring': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
  'mcb-repair': 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=800',
  'electrical-inspection': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
  'light-installation': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800',
  'power-failure-repair': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
  'inverter-installation': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800',
  'doorbell-installation': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',

  // 2. AC Service
  'ac-general-service': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800',
  'ac-deep-cleaning': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800',
  'ac-repair': 'https://images.unsplash.com/photo-1590756254933-2873d72a83b6?auto=format&fit=crop&q=80&w=800',
  'ac-installation': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
  'ac-uninstallation': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
  'ac-gas-refill': 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&q=80&w=800',
  'ac-water-leakage-repair': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
  'ac-cooling-problem-repair': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800',
  'ac-annual-maintenance': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',

  // 3. Plumbing
  'tap-repair': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
  'pipe-leakage-repair': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800',
  'drain-cleaning': 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=800',
  'bathroom-fitting': 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800',
  'toilet-repair': 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&q=80&w=800',
  'water-tank-cleaning': 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800',
  'sink-repair': 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80&w=800',
  'shower-installation': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
  'water-pipeline-installation': 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',

  // 4. Appliance Repair
  'washing-machine-repair': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=800',
  'refrigerator-repair': 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800',
  'microwave-repair': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&q=80&w=800',
  'geyser-repair': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800',
  'chimney-repair': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=800',
  'water-heater-repair': 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800',
  'dishwasher-repair': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',

  // 5. CCTV
  'cctv-installation': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
  'cctv-camera-repair': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
  'cctv-maintenance': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
  'dvr-nvr-setup': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
  'cctv-system-inspection': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
  'home-security-setup': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',

  // 6. RO / Water
  'ro-installation': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&q=80&w=800',
  'ro-repair': 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=800',
  'ro-filter-replacement': 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&q=80&w=800',
  'water-purifier-service': 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&q=80&w=800',
  'water-purifier-maintenance': 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=800',
  'water-quality-check': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800',

  // 7. Cleaning
  'home-deep-cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
  'bathroom-cleaning': 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800',
  'kitchen-cleaning': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
  'sofa-cleaning': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800',
  'carpet-cleaning': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
  'office-cleaning': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
  'move-in-move-out-cleaning': 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=800',

  // 8. Installation
  'tv-wall-mounting': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
  'furniture-assembly': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
  'curtain-installation': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
  'wall-shelf-installation': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800',
  'mirror-installation': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
  'smart-device-installation': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
  'appliance-installation': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=800',
};

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
    
    // Dedicated, unique high-definition image for this specific service
    const uniqueImagePath = SERVICE_IMAGE_MAP[slug] || `/images/services/${slug}.jpg`;
    
    result.push({
      id: `ps${idCounter++}`,
      slug,
      categoryId: catId,
      categorySlug: catSlug,
      name,
      price,
      duration,
      rating: parseFloat((4.8 + (Math.random() * 0.18)).toFixed(1)),
      reviews: Math.floor(Math.random() * 500) + 65,
      image: uniqueImagePath,
      description: desc,
      included: [
        'Professional service delivery by certified expert',
        'Safety & diagnostic inspection included',
        'Standard tools & equipment brought on-site',
        'Post-service cleanup and performance testing'
      ],
      notIncluded: [
        'Cost of replacement spare parts (if required)',
        'Major structural or wall modifications'
      ],
      warranty: '30 Days Comprehensive Service Warranty',
      faqs: [
        { q: 'Is there a warranty on this service?', a: 'Yes, we provide a 30-day comprehensive service warranty.' },
        { q: 'Can I pay via Cash on Delivery (COD)?', a: 'Yes! You can choose Pay after Service (Cash on Delivery) and pay in cash or UPI once the job is completed.' },
        { q: 'Are your technicians verified?', a: 'All our service professionals undergo rigorous background verification and skill certification.' }
      ]
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