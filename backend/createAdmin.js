const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'CUSTOMER' },
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model('User', UserSchema);

async function findAndFixAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homepro');
    console.log('Connected to MongoDB');

    let admins = await User.find({ role: { $in: ['ADMIN', 'SUPER_ADMIN'] } });
    
    if (admins.length > 0) {
      console.log(`Found ${admins.length} admin(s)`);
      for (const admin of admins) {
        console.log(`- ${admin.email} (Phone: ${admin.phone}, Role: ${admin.role})`);
        // update password to admin123
        const salt = await bcrypt.genSalt(10);
        admin.passwordHash = await bcrypt.hash('admin123', salt);
        await admin.save();
        console.log(`  -> Password reset to: admin123`);
      }
    } else {
      console.log('No admins found. Creating one...');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin123', salt);
      const admin = new User({
        name: 'Super Admin',
        email: 'admin@homepro.com',
        phone: Date.now().toString().slice(-10),
        passwordHash,
        role: 'SUPER_ADMIN',
        isVerified: true
      });
      await admin.save();
      console.log('Admin user created successfully.');
      console.log(`Email: ${admin.email}`);
      console.log('Password: admin123');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

findAndFixAdmin();
