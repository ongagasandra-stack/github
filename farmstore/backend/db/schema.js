const { Database } = require('node-sqlite3-wasm');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'farmstore.db');
const db = new Database(dbPath);

function initializeDatabase() {
  db.run(`
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
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      farmer_name TEXT NOT NULL,
      farmer_phone TEXT NOT NULL,
      facility_id TEXT NOT NULL,
      produce_type TEXT NOT NULL,
      quantity_tons REAL NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL
    )
  `);

  const count = db.get('SELECT COUNT(*) as cnt FROM storage_facilities');
  if (count.cnt === 0) {
    const insertFacility = (item) => db.run(`
      INSERT INTO storage_facilities
        (id, owner_name, facility_name, location, county, latitude, longitude,
         capacity_tons, available_space_tons, price_per_day, price_per_week,
         price_per_month, produce_types, description, phone, email, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [item.id, item.owner_name, item.facility_name, item.location, item.county,
        item.latitude, item.longitude, item.capacity_tons, item.available_space_tons,
        item.price_per_day, item.price_per_week, item.price_per_month,
        item.produce_types, item.description, item.phone, item.email, item.created_at]);

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
        produce_types: JSON.stringify(['Vegetables', 'Fruits', 'Tea']),
        description: 'State-of-the-art cold storage facility in the heart of Nairobi\'s Westlands. Equipped with temperature control systems ranging from 2°C to 15°C, 24/7 security with CCTV, forklift access, and easy Waiyaki Way highway access for transport logistics.',
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
        description: 'Large grain storage facility serving the Rift Valley agricultural region. Features professional fumigation services, grain moisture testing, bulk handling equipment with conveyor belts, and easy access to the Nakuru-Nairobi highway for efficient produce movement.',
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
        description: 'Specialized storage hub at the foot of Mount Kenya, designed specifically for high-value produce like premium Meru coffee and Kenyan tea. Maintains optimal humidity levels between 60-70% and temperature control to preserve quality and prevent spoilage.',
        phone: '+254 733 567 890',
        email: 'peter.gitonga@mtkenyahub.co.ke',
        created_at: new Date().toISOString()
      },
      {
        id: 'fac-004',
        owner_name: 'Grace Otieno',
        facility_name: 'Lakeside Storage Solutions',
        location: 'Milimani, Kisumu',
        county: 'Kisumu',
        latitude: -0.0917,
        longitude: 34.7680,
        capacity_tons: 750,
        available_space_tons: 500,
        price_per_day: 1500,
        price_per_week: 9500,
        price_per_month: 32000,
        produce_types: JSON.stringify(['Rice', 'Vegetables', 'Fruits']),
        description: 'Versatile storage facility near Lake Victoria, serving the Nyanza farming and fishing communities. Dedicated refrigerated sections maintain freshness, with easy Kisumu port connections for regional distribution. Serves rice farmers from Ahero irrigation scheme.',
        phone: '+254 744 678 901',
        email: 'grace.otieno@lakesidestorage.co.ke',
        created_at: new Date().toISOString()
      },
      {
        id: 'fac-005',
        owner_name: 'Daniel Cheruiyot',
        facility_name: 'North Rift Agri-Store',
        location: 'Langas, Eldoret',
        county: 'Uasin Gishu',
        latitude: 0.5143,
        longitude: 35.2698,
        capacity_tons: 1200,
        available_space_tons: 800,
        price_per_day: 1600,
        price_per_week: 10000,
        price_per_month: 35000,
        produce_types: JSON.stringify(['Maize', 'Wheat', 'Beans']),
        description: 'The largest grain storage facility in North Rift Valley. Serves thousands of farmers from Uasin Gishu and Trans Nzoia counties with modern steel silos, industrial grain drying equipment, and professional pest management. Conveniently located along the Eldoret-Nakuru highway.',
        phone: '+254 755 789 012',
        email: 'daniel.cheruiyot@northriftagri.co.ke',
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
        description: 'Serving Eastern Kenya farmers with quality storage solutions since 2018. Specializes in legumes and dry grains with hermetic bag storage options available. Offers flexible short-term (1 day minimum) and long-term storage with competitive pricing and 24/7 reliable security.',
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
        description: 'Premium fresh produce storage facility along Thika Superhighway. Strategically located for easy access to Nairobi markets, with multiple climate-controlled chambers maintaining different temperatures for fruits and vegetables. Serves coffee farmers from the Kiambu cooperative societies.',
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
        description: 'Kenya\'s breadbasket region premier storage hub. Trans Nzoia Grain Hub offers the most affordable bulk grain storage in the North Rift with modern hermetic silo technology, professional pest management, and grain quality preservation services. Serving over 2,000 farmers annually.',
        phone: '+254 788 012 345',
        email: 'sarah.wekesa@transnzoiagrain.co.ke',
        created_at: new Date().toISOString()
      }
    ];

    db.run('BEGIN');
    try {
      for (const item of facilities) insertFacility(item);
      db.run('COMMIT');
    } catch (e) {
      db.run('ROLLBACK');
      throw e;
    }
    console.log('Database seeded with 8 storage facilities.');
  }

  console.log('Database initialized successfully.');
}

module.exports = { db, initializeDatabase };
