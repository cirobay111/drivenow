-- DriveNow Database Schema

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cars (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  seats INTEGER NOT NULL,
  transmission VARCHAR(50) NOT NULL,
  image_url VARCHAR(500),
  description TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  car_id INTEGER REFERENCES cars(id) ON DELETE SET NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  pickup_location VARCHAR(200) NOT NULL,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed admin user (password: Admin@123)
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@drivenow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed sample cars
INSERT INTO cars (brand, model, year, price_per_day, fuel_type, seats, transmission, image_url, description) VALUES
('BMW', 'M4 Competition', 2023, 150.00, 'Gasoline', 4, 'Automatic', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'The ultimate driving machine. Powerful, elegant, and thrilling.'),
('Mercedes-Benz', 'C-Class AMG', 2023, 140.00, 'Gasoline', 5, 'Automatic', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'Luxury and performance in perfect harmony.'),
('Audi', 'A6 Quattro', 2022, 130.00, 'Gasoline', 5, 'Automatic', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 'Refined performance with quattro all-wheel drive.'),
('Porsche', 'Cayenne', 2023, 200.00, 'Gasoline', 5, 'Automatic', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', 'The SUV that performs like a sports car.'),
('Tesla', 'Model S', 2023, 160.00, 'Electric', 5, 'Automatic', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', 'The future of driving. Zero emissions, pure performance.'),
('Range Rover', 'Sport HSE', 2022, 180.00, 'Diesel', 5, 'Automatic', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', 'Luxury SUV built for any terrain.'),
('Lamborghini', 'Huracán', 2022, 500.00, 'Gasoline', 2, 'Automatic', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800', 'Extreme performance. Pure Italian passion.'),
('Ferrari', '488 Spider', 2022, 600.00, 'Gasoline', 2, 'Automatic', 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800', 'Open-top thrills from the prancing horse.')
ON CONFLICT DO NOTHING;
