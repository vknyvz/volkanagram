import mongoose from "mongoose"
import bcrypt from 'bcryptjs'
import User from '../models/User'

const MONGO_URI = "mongodb://localhost:27017/volkanagram";

const users = [
  { fullName: "Volkan Yavuz", username: "vknyvz", email: "vkn@vknyvz.com", password: "111111" },
  { fullName: "Arda Basaran", username: "arda_basaran", email: "arda@basaran.com", password: "111111" },
  { fullName: "Abdullah Ayaz", username: "abdullah_ayaz", email: "abdullah@ayaz.com", password: "111111" },
  { fullName: "Cenk Tarlaci", username: "cenk_tarlaci", email: "cenk@tarlaci.com", password: "111111" },
  { fullName: "Ibrahim Emir", username: "ibrahim_emir", email: "ibrahim@emir.com", password: "111111" },
  { fullName: "Musa Boztepe", username: "musa_boztepe", email: "musa@boztepe.com", password: "111111" },
  { fullName: "Onur Ertürk", username: "onur_erturk", email: "onur@erturk.com", password: "111111" },
  { fullName: "Yasin Ergin", username: "yasin_ergin", email: "yasin@ergin.com", password: "111111" },
  { fullName: "Halil Bayram", username: "halil_bayram", email: "halil@bayram.com", password: "111111" },
  { fullName: "Ilkay Kalayci", username: "ilkay_kalayci", email: "ilkay@kalayci.com", password: "111111" },
  { fullName: "Ekim Talay", username: "october", email: "ekim@talay.com", password: "111111" },
  { fullName: "Serdar Barut", username: "serdar_barut", email: "serdar@barut.com", password: "111111" },
  { fullName: "Tuncay Sener", username: "tuncay_sener", email: "tuncay@sener.com", password: "111111" },
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Connected to MongoDB")

    const testEmails = users.map((u) => u.email)

    const deleteResult = await User.deleteMany({ email: { $in: testEmails } })
    console.log(`🗑 Deleted ${deleteResult.deletedCount} existing test users`)

    for (const u of users) {
      const hashedPassword = await bcrypt.hash(u.password, 10)
      await User.create({
        email: u.email,
        password: hashedPassword,
        fullName: u.fullName,
        username: u.username,
      })
      console.log(`✅ Created user: ${u.email}`)
    }

    console.log("🌱 Test users seeded successfully")
    process.exit(0)
  } catch (err) {
    console.error("❌ Error seeding users:", err)
    process.exit(1)
  }
}

void seedUsers();
