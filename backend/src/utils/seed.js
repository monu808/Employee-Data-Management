const { initializeDatabase } = require('./database');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await initializeDatabase();
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;