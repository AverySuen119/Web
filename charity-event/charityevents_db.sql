-- charityevents_db.sql
DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;

-- Organisations table
CREATE TABLE organisations (
  organisation_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  mission TEXT,
  contact_email VARCHAR(150),
  contact_phone VARCHAR(50),
  address VARCHAR(255),
  website VARCHAR(255)
);

-- Categories table
CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255)
);

-- Events table
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

-- Organisations data
INSERT INTO organisations (name, mission, contact_email, contact_phone, address, website) VALUES
('Paws & Whiskers', 'Rescue and care for abandoned pets', 'info@pawswhiskers.org', '+61 2 9000 0101', '12 Animal St, Petville', 'https://pawswhiskers.example.org'),
('Happy Tails Foundation', 'Support animal shelters and adoption', 'contact@happytails.org', '+61 2 9000 0102', '34 Rescue Rd, Petville', 'https://happytails.example.org'),
('Wildlife Protectors', 'Protect wildlife and endangered species', 'hello@wildlifeprotect.org', '+61 2 9000 0103', '7 Forest Lane, Petville', 'https://wildlifeprotect.example.org');

-- Categories data
INSERT INTO categories (name, description) VALUES
('Pet Fun Run', 'Running events to support animal welfare'),
('Animal Gala', 'Formal dinners and charity auctions for animals'),
('Pet Adoption Fair', 'Events to promote adoption of pets'),
('Wildlife Concert', 'Music events supporting wildlife protection'),
('Charity Walk', 'Community walks to raise awareness for animals'),
('Bake Sale', 'Baking events to raise funds for shelters');

-- Events data (corrected)
INSERT INTO events 
(event_id,organisation_id, category_id, name, short_desc, full_desc, event_date, location_name, location_address, price, is_free, capacity, image_url, goal_amount, raised_amount, is_suspended)
VALUES
(1, 1, 1, 'City Paws Fun Run 2025', '5km run to help animal shelters', 'Join our 5km run to raise funds for local animal shelters.', '2025-10-10 08:00:00', 'Central Park', 'Central Park, Petville', 25.00, 0, 500, '', 5000.00, 3200.00, 0),
(2, 2, 2, 'Happy Tails Gala Dinner 2025', 'A black-tie gala for rescued pets', 'Enjoy a gala with auctions supporting animal adoption. Gala with auctions and guest speakers to support pets in need.', '2025-12-05 19:00:00', 'Grand Hotel Ballroom', '1 Grand St, Petville', 150.00, 0, 200, '', 20000.00, 8500.00, 0),
(3, 3, 4, 'Pet Concert 2026', 'Outdoor concert for wildlife protection', 'Live bands, food trucks, and fundraising for endangered species. All proceeds will go to wildlife protection initiatives.', '2026-03-15 16:00:00', 'Riverside Amphitheatre', 'Riverside, Petville', 40.00, 0, 1000, '', 10000.00, 1500.00, 0),
(4, 1, 3, 'Pet Adoption Fair 2024', 'Meet pets looking for a home', 'Come and adopt your new furry friend. Exclusive event with cats, dogs, and small animals for adoption.', '2024-11-20 10:00:00', 'Community Hall', '12 Animal St, Petville', 0.00, 1, 150, '', 8000.00, 8000.00, 0),
(5, 2, 5, 'Annual Charity Walk for Animals 2026', '10km walk to support shelters', 'Walk to raise awareness and funds for abandoned pets. Join our community walk to support animal welfare.', '2026-05-10 07:30:00', 'Harbor Pier', 'Harbor Pier, Petville', 10.00, 0, 400, '', 4000.00, 1200.00, 0),
(6, 3, 6, 'Neighborhood Pet Bake Sale 2025', 'Home baked goodies for pets', 'Bake sale organized to help local animal shelters. Proceeds go directly to pet care and shelter programs.', '2025-08-01 09:00:00', 'Green Street Market', 'Green St, Petville', 0.00, 1, 300, '', 500.00, 450.00, 0),
(7, 1, 1, 'City Mini Paws Fun Run 2024', '2km kids run with pets', 'Family-friendly mini run for kids and pets. Support local shelters while enjoying a fun day.', '2024-06-15 09:00:00', 'Kids Park', 'Kids Park, Petville', 0.00, 1, 200, '', 200.00, 200.00, 0),
(8, 2, 4, 'Community Acoustic Concert ', 'Local bands for animal welfare', 'This event was suspended due to policy. All proceeds were intended for animal shelters.', '2025-11-01 18:00:00', 'Old Town Square', 'Old Town, Petville', 20.00, 0, 300, '', 1500.00, 200.00, 0),
(9, 1, 3, 'Winter Pet Adoption Carnival 2026', 'Family-friendly pet adoption event', 'Join us for a fun-filled day to meet and adopt cats, dogs, and small animals. Enjoy pet games and adoption counseling.', '2026-01-15 10:00:00', 'Petville Community Center', '15 Animal St, Petville', 0.00, 1, 200, '', 10000.00, 2500.00, 0),
(10, 3, 4, 'Wildlife Charity Night 2026', 'Evening concert for endangered species', 'An enchanting night of acoustic music and fundraising to protect wildlife. All proceeds support conservation programs.', '2026-04-20 19:30:00', 'Moonlight Amphitheatre', '10 Riverside Dr, Petville', 50.00, 0, 800, '', 15000.00, 3000.00, 0);