-- charityevents_db.sql
DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;

CREATE TABLE organisations (
  organisation_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  mission TEXT,
  contact_email VARCHAR(150),
  contact_phone VARCHAR(50),
  address VARCHAR(255),
  website VARCHAR(255)
);

CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  organisation_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  short_desc VARCHAR(255),
  full_desc TEXT,
  event_date DATETIME NOT NULL,
  location_name VARCHAR(150),
  location_address VARCHAR(255),
  price DECIMAL(10,2) DEFAULT 0.00,
  is_free TINYINT(1) DEFAULT 0,
  capacity INT DEFAULT NULL,
  image_url VARCHAR(512),
  goal_amount DECIMAL(12,2) DEFAULT 0.00,
  raised_amount DECIMAL(12,2) DEFAULT 0.00,
  is_suspended TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organisation_id) REFERENCES organisations(organisation_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);

INSERT INTO organisations (name, mission, contact_email, contact_phone, address, website) VALUES
('Sunrise Charity', 'Support local children education', 'info@sunrise.org', '+61 2 9000 0001', '10 Charity St, Cityville', 'https://sunrise.example.org'),
('Helping Hands Foundation', 'Provide food and shelter to the homeless', 'contact@helpinghands.org', '+61 2 9000 0002', '22 Help Ave, Cityville', 'https://helpinghands.example.org'),
('GreenEarth Org', 'Environmental protection and tree planting', 'hello@greenearth.org', '+61 2 9000 0003', '5 Green Rd, Cityville', 'https://greenearth.example.org');

INSERT INTO categories (name, description) VALUES
('Fun Run', 'Running events for fundraising'),
('Gala Dinner', 'Formal dinners and auctions'),
('Silent Auction', 'Bid for items silently'),
('Concert', 'Music events to raise funds'),
('Charity Walk', 'Community walks for awareness'),
('Bake Sale', 'Local bake sales');

INSERT INTO events (organisation_id, category_id, name, short_desc, full_desc, event_date, location_name, location_address, price, is_free, capacity, image_url, goal_amount, raised_amount, is_suspended)
VALUES
(1, 1, 'City Sunrise Fun Run 2025', '5km fun run to support schools', 'Join our 5km fun run to raise funds for school supplies.', '2025-10-10 08:00:00', 'Central Park', 'Central Park, Cityville', 25.00, 0, 500, '', 5000.00, 3200.00, 0),
(2, 2, 'Helping Hands Gala Dinner 2025', 'A black-tie gala to support shelters', 'Gala with auctions and guest speakers.', '2025-12-05 19:00:00', 'Grand Hotel Ballroom', '1 Grand St, Cityville', 150.00, 0, 200, '', 20000.00, 8500.00, 0),
(3, 4, 'GreenEarth Concert for Trees', 'Outdoor concert to fund tree planting', 'Live bands and food trucks, proceeds fund tree planting.', '2026-03-15 16:00:00', 'Riverside Amphitheatre', 'Riverside, Cityville', 40.00, 0, 1000, '', 10000.00, 1500.00, 0),
(1, 3, 'Charity Silent Auction (Nov 2024)', 'Auction of donated items', 'Exclusive silent auction of art and goods.', '2024-11-20 18:00:00', 'Community Hall', '10 Charity St, Cityville', 0.00, 1, 150, '', 8000.00, 8000.00, 0),
(2, 5, 'Annual Charity Walk 2026', '10km walk for community', 'Walk to raise awareness and funds for the homeless.', '2026-05-10 07:30:00', 'Harbor Pier', 'Harbor Pier, Cityville', 10.00, 0, 400, '', 4000.00, 1200.00, 0),
(3, 6, 'Neighborhood Bake Sale (Aug 2025)', 'Home baked goods sale', 'Bake sale by local volunteers.', '2025-08-01 09:00:00', 'Green Street Market', 'Green St, Cityville', 0.00, 1, 300, '', 500.00, 450.00, 0),
(1, 1, 'City Mini Fun Run (Past)', '2km kids run', 'Family-friendly mini run for kids.', '2024-06-15 09:00:00', 'Kids Park', 'Kids Park, Cityville', 0.00, 1, 200, '', 200.00, 200.00, 0),
(2, 4, 'Community Acoustic Concert (Suspended)', 'Local bands performing', 'This event was suspended due to policy.', '2025-11-01 18:00:00', 'Old Town Square', 'Old Town, Cityville', 20.00, 0, 300, '', 1500.00, 200.00, 1);
