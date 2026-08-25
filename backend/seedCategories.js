const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const serviceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ServiceCategory = mongoose.model('ServiceCategory', serviceCategorySchema);

const categoriesToSeed = [
  "Electrical",
  "AC Service",
  "Plumbing",
  "Appliance Repair",
  "Fan Repair",
  "Refrigerator Repair",
  "Home Cleaning",
  "CCTV / Security",
  "RO / Water Service",
  "Installation",
  "Washing Machine Repair",
  "Geyser Repair",
  "Microwave / Kitchen Appliance Repair",
  "Other Home Services"
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/homepro');
    console.log('MongoDB Connected');
    
    // Create categories if they don't exist
    for (const catName of categoriesToSeed) {
      const existing = await ServiceCategory.findOne({ name: catName });
      if (!existing) {
        await ServiceCategory.create({
          name: catName,
          description: `${catName} services`,
        });
        console.log(`Seeded: ${catName}`);
      }
    }
    
    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
