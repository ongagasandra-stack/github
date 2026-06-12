const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'farmstore.db');
const db = new Database(dbPath);

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS storage_facilities (
      id TEXT PRIMARY KEY,
      owner_name TEXT NOT NULL,
      facility_name TEXT NOT NULL,
      location TEXT NOT NULL,
      county TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      capacity_tons REAL NOT NULL,
      available_space_tons REAL NOT NULL,
      price_per_day REAL NOT NULL,
      price_per_week REAL NOT NULL,
      price_per_month REAL NOT NULL,
      produce_types TEXT NOT NULL,
      description TEXT,
      phone TEXT,
      email TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      farmer_name TEXT NOT NULL,
      farmer_phone TEXT NOT NULL,
      facility_id TEXT NOT NULL,
      produce_type TEXT NOT NULL,
      quantity_tons REAL NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      status TEXT DEFAULT 'confirmed',
      created_at TEXT NOT NULL,
      FOREIGN KEY (facility_id) REFERENCES storage_facilities(id)
    );
  `);

  const existingCount = db.prepare('SELECT COUNT(*) as count FROM storage_facilities').get();
  if (existingCount.count === 0) {
    const insertFacility = db.prepare(`
      INSERT INTO storage_facilities
        (id, owner_name, facility_name, location, county, latitude, longitude,
         capacity_tons, available_space_tons, price_per_day, price_per_week,
         price_per_month, produce_types, description, phone, email, created_at)
      VALUES
        (@id, @owner_name, @facility_name, @location, @county, @latitude, @longitude,
         @capacity_tons, @available_space_tons, @price_per_day, @price_per_week,
         @price_per_month, @produce_types, @description, @phone, @email, @created_at)
    `);

    const facilities = [
      {
        id: 'fac-001',
        owner_name: 'James Mwangi',
        facility_name: 'Westlands Cold Storage',
        location: 'Westlands, Nairobi',
        county: 'Nairobi',
        latitude: -1.2921,
        longitude: 36.8219,
        capacity_tons: 500,
        available_space_tons: 350,
        price_per_day: 2500,
        price_per_week: 15000,
        price_per_month: 50000,
        produce_types: JSON.stringify(['Vegetables', 'Fruits', 'Dairy']),
        description: 'State-of-the-art cold storage facility in the heart of Westlands, Nairobi. Equipped with temperature control systems, 24/7 security, and easy highway access. Ideal for perishable goods requiring refrigeration.',
        phone: '+254 712 345 678',
        email: 'james.mwangi@westlandscold.co.ke',
        created_at: new Date().toISOString()
      },
      {
        id: 'fac-002',
        owner_name: 'Mary Wanjiku',
        facility_name: 'Rift Valley Grain Store',
        location: 'Industrial Area, Nakuru',
        county: 'Nakuru',
        latitude: -0.3031,
        longitude: 36.0800,
        capacity_tons: 1000,
        available_space_tons: 650,
        price_per_day: 1800,
        price_per_week: 11000,
        price_per_month: 38000,
        produce_types: JSON.stringify(['Maize', 'Wheat', 'Barley']),
        description: 'Large-capacity grain storage facility serving the Rift Valley agricultural belt. Features fumigation services, moisture monitoring, and bulk handling equipment. Perfect for post-harvest cereal storage.',
        phone: '+254 722 456 789',
        email: 'mary.wanjiku@riftvalleygrain.co.ke',
        created_at: new Date().toISOString()
      },
      {
        id: 'fac-003',
        owner_name: 'Peter Gitonga',
        facility_name: 'Mount Kenya Produce Hub',
        location: 'Meru Town, Meru',
        county: 'Meru',
        latitude: 0.0467,
        longitude: 37.6490,
        capacity_tons: 300,
        available_space_tons: 180,
        price_per_day: 2000,
        price_per_week: 13000,
        price_per_month: 42000,
        produce_types: JSON.stringify(['Coffee', 'Tea', 'Potatoes']),
        description: 'Specialized storage hub near Mount Kenya region, designed for high-value crops. Climate-controlled sections for coffee and tea, plus dry storage for root vegetables. Certified for export-grade produce.',
        phone: '+254 733 567 890',
        email: 'peter.gitonga@mtkenyahub.co.ke',
        created_at: new Date().toISOString()
      },
      {
        id: 'fac-004',
        owner_name: 'Grace Otieno',
        facility_name: 'Lakeside Storage Solutions',
        location: 'Kisumu Port Area, Kisumu',
        county: 'Kisumu',
        latitude: -0.0917,
        longitude: 34.7680,
        capacity_tons: 750,
        available_space_tons: 500,
        price_per_day: 1500,
        price_per_week: 9500,
        price_per_month: 32000,
        produce_types: JSON.stringify(['Rice', 'Vegetables', 'Fish']),
        description: 'Strategic storage near Kisumu Port offering easy lake transport connections. Specialized fish storage with ice facilities and cold chain management. Also handles rice and general vegetable storage.',
        phone: '+254 744 678 901',
        email: 'grace.otieno@lakesidestorage.co.ke',
        created_at: new Date().toISOString()
      },
      {
        id: 'fac-005',
        owner_name: 'Daniel Cheruiyot',
        facility_name: 'North Rift Agri-Store',
        location: 'Eldoret Industrial Zone, Eldoret',
        county: 'Uasin Gishu',
        latitude: 0.5143,
        longitude: 35.2698,
        capacity_tons: 1200,
        available_space_tons: 800,
        price_per_day: 1600,
        price_per_week: 10000,
        price_per_month: 35000,
        produce_types: JSON.stringify(['Maize', 'Wheat', 'Beans']),
        description: 'Kenya\'s largest agri-storage facility in the breadbasket of North Rift. Modern silo systems with automated handling, pest control, and real-time inventory tracking. Serves large-scale and smallholder farmers alike.',
        phone: '+254 755 789 012',
        email: 'daniel.cheruiyot@northriftstore.co.ke',
        created_at: new Date().toISOString()
      },
      {
        id: 'fac-006',
        owner_name: 'Agnes Mutua',
        facility_name: 'Eastern Harvest Storage',
        location: 'Machakos Town, Machakos',
        county: 'Machakos',
        latitude: -1.5177,
        longitude: 37.2634,
        capacity_tons: 400,
        available_space_tons: 250,
        price_per_day: 1700,
        price_per_week: 11500,
        price_per_month: 39000,
        produce_types: JSON.stringify(['Beans', 'Maize', 'Fruits']),
        description: 'Community-focused storage facility serving Eastern Kenya smallholder farmers. Affordable rates with flexible booking terms. Specializes in legumes, cereals, and fresh fruit temporary storage.',
        phone: '+254 766 890 123',
        email: 'agnes.mutua@easternharvest.co.ke',
        created_at: new Date().toISOString()
      },
      {
        id: 'fac-007',
        owner_name: 'John Kamau',
        facility_name: 'Blue Nile Fresh Storage',
        location: 'Thika Road, Thika',
        county: 'Kiambu',
        latitude: -1.0332,
        longitude: 37.0693,
        capacity_tons: 600,
        available_space_tons: 400,
        price_per_day: 2200,
        price_per_week: 14000,
        price_per_month: 47000,
        produce_types: JSON.stringify(['Coffee', 'Vegetables', 'Fruits']),
        description: 'Premium fresh produce storage along Thika Road corridor. Purpose-built for export-quality coffee and horticultural products. Features ethylene management systems, humidity control, and quality inspection bays.',
        phone: '+254 777 901 234',
        email: 'john.kamau@bluenilefresh.co.ke',
        created_at: new Date().toISOString()
      },
      {
        id: 'fac-008',
        owner_name: 'Sarah Wekesa',
        facility_name: 'Trans Nzoia Grain Hub',
        location: 'Kitale Town, Kitale',
        county: 'Trans Nzoia',
        latitude: 1.0154,
        longitude: 35.0062,
        capacity_tons: 900,
        available_space_tons: 600,
        price_per_day: 1400,
        price_per_week: 9000,
        price_per_month: 30000,
        produce_types: JSON.stringify(['Maize', 'Wheat', 'Sunflower']),
        description: 'The premier grain hub in Trans Nzoia County, Kenya\'s top maize-producing region. Offers competitive rates for bulk grain storage, drying services, and aggregation for smallholder cooperatives.',
        phone: '+254 788 012 345',
        email: 'sarah.wekesa@transnzoiagrain.co.ke',
        created_at: new Date().toISOString()
      }
    ];

    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insertFacility.run(item);
      }
    });

    insertMany(facilities);
    console.log('Database seeded with 8 storage facilities.');
  }

  console.log('Database initialized successfully.');
}

module.exports = { db, initializeDatabase };
