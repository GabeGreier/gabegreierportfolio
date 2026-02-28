insert into public.projects (
  id,
  title,
  slug,
  short_description,
  full_description,
  problem_goal,
  what_built,
  tools_stack,
  challenges,
  learnings,
  github_url,
  live_url,
  cover_image_url,
  featured,
  published
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'FPGA Distortion Pedal',
    'fpga-distortion-pedal',
    'A real-time guitar distortion pedal implemented on FPGA with custom DSP signal flow.',
    'This project explored low-latency audio signal processing on FPGA, mapping analog-inspired distortion curves and tone shaping to hardware for immediate response.',
    'Build a performant, programmable distortion pedal with deterministic latency and deep control over the tone pipeline.',
    'Designed and tested a Verilog DSP chain, integrated ADC/DAC IO, and created a configurable signal architecture with clipping, EQ, and output shaping blocks.',
    '["Verilog", "FPGA", "Quartus", "Oscilloscope", "PCB Prototyping"]'::jsonb,
    'Managing quantization artifacts, balancing clip character with headroom, and keeping latency imperceptible during iterative tone testing.',
    'Gained practical understanding of fixed-point DSP and hardware debugging under real-world audio constraints.',
    null,
    null,
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80',
    true,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Ring & Rink',
    'ring-and-rink',
    'A polished React web experience for discovering and organizing local skating events.',
    'Ring & Rink focused on clean information architecture and performant UI patterns to keep discovery fast on mobile and desktop.',
    'Create an interface that makes planning skating sessions frictionless while presenting event details clearly.',
    'Built reusable React UI modules, location-aware listings, event detail pages, and a simplified booking flow with reliable responsive behavior.',
    '["React", "TypeScript", "Tailwind CSS", "Vercel"]'::jsonb,
    'Maintaining strong responsiveness while keeping the experience lightweight with rich card-based layouts.',
    'Improved front-end system design discipline and component API design for long-term maintainability.',
    'https://github.com/',
    'https://example.com',
    'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1400&q=80',
    true,
    true
  )
on conflict (id) do nothing;

insert into public.project_images (project_id, image_url, alt_text, sort_order)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80',
    'FPGA board and pedal prototype',
    0
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'https://images.unsplash.com/photo-1551808525-51a94da548ce?auto=format&fit=crop&w=1400&q=80',
    'Ring & Rink app screens',
    0
  )
on conflict do nothing;

insert into public.visuals (
  title,
  description,
  image_url,
  thumbnail_url,
  tags,
  featured,
  published,
  shot_date
)
values
  (
    'Midnight GT',
    'Low-angle cinematic roll shot with deep contrast.',
    'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=640&q=70',
    array['Lambo', 'Night', 'Rolling'],
    true,
    true,
    now()::date
  ),
  (
    'Afterglow Coupe',
    'Warm dusk tones and clean reflections.',
    'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=640&q=70',
    array['Porsche', 'Sunset', 'Coupe'],
    true,
    true,
    now()::date
  ),
  (
    'Trackside Red',
    'Compressed telephoto perspective with subtle motion blur.',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=640&q=70',
    array['Ferrari', 'Track', 'Action'],
    true,
    true,
    now()::date
)
on conflict do nothing;

-- Task 2 seed data for dealership portal MVP
insert into public.dealers (id, name, slug)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Demo Auto Group', 'demo-auto-group'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Northside Motors', 'northside-motors')
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug;

insert into public.profiles (id, dealer_id, role, display_name)
values
  ('00000000-0000-0000-0000-000000000001', null, 'SUPER_ADMIN', 'Platform Owner'),
  ('00000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'DEALER_MANAGER', 'Demo Manager'),
  ('00000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'DEALER_STAFF', 'Demo Staff'),
  ('00000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'DEALER_MANAGER', 'Northside Manager')
on conflict (id) do update
set
  dealer_id = excluded.dealer_id,
  role = excluded.role,
  display_name = excluded.display_name;

insert into public.checklist_templates (id, dealer_id, name)
values
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Standard'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Standard')
on conflict (id) do update
set
  dealer_id = excluded.dealer_id,
  name = excluded.name;

insert into public.vehicles (
  id,
  dealer_id,
  stock_number,
  vin,
  year,
  make,
  model,
  trim,
  mileage_km,
  price_cad,
  color,
  notes,
  status,
  created_by
)
values
  (
    'dddddddd-dddd-dddd-dddd-dddddddddd01',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'DAG-1001',
    '1HGBH41JXMN109186',
    2021,
    'Toyota',
    'RAV4',
    'XLE',
    45600,
    33995,
    'Silver',
    'Fresh detail complete.',
    'NEW',
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddd02',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'NSM-2002',
    '2FTRX18L1XCA01234',
    2019,
    'Ford',
    'F-150',
    'XLT',
    81200,
    31995,
    'Blue',
    'Needs fresh front grille shot.',
    'PHOTOS_IN',
    '00000000-0000-0000-0000-000000000004'
  )
on conflict (id) do update
set
  dealer_id = excluded.dealer_id,
  stock_number = excluded.stock_number,
  vin = excluded.vin,
  year = excluded.year,
  make = excluded.make,
  model = excluded.model,
  trim = excluded.trim,
  mileage_km = excluded.mileage_km,
  price_cad = excluded.price_cad,
  color = excluded.color,
  notes = excluded.notes,
  status = excluded.status,
  created_by = excluded.created_by;

insert into public.checklist_items (
  id,
  dealer_id,
  vehicle_id,
  label,
  key,
  state,
  notes,
  updated_by
)
values
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'dddddddd-dddd-dddd-dddd-dddddddddd01',
    'Front 3/4',
    'front_3_4',
    'missing',
    null,
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'dddddddd-dddd-dddd-dddd-dddddddddd01',
    'Odometer',
    'odometer',
    'missing',
    null,
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'dddddddd-dddd-dddd-dddd-dddddddddd02',
    'Driver side',
    'driver_side',
    'retake',
    'Retake with less glare.',
    '00000000-0000-0000-0000-000000000004'
)
on conflict (id) do update
set
  dealer_id = excluded.dealer_id,
  vehicle_id = excluded.vehicle_id,
  label = excluded.label,
  key = excluded.key,
  state = excluded.state,
  notes = excluded.notes,
  updated_by = excluded.updated_by;

insert into public.photos (
  id,
  dealer_id,
  vehicle_id,
  storage_path,
  original_filename,
  label,
  sort_index,
  uploaded_by
)
values
  (
    'ffffffff-ffff-ffff-ffff-fffffffffff1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'dddddddd-dddd-dddd-dddd-dddddddddd01',
    'dealers/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/vehicles/dddddddd-dddd-dddd-dddd-dddddddddd01/ffffffff-ffff-ffff-ffff-fffffffffff1.jpg',
    'rav4-front.jpg',
    'front_3_4',
    1,
    '00000000-0000-0000-0000-000000000003'
  ),
  (
    'ffffffff-ffff-ffff-ffff-fffffffffff2',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'dddddddd-dddd-dddd-dddd-dddddddddd02',
    'dealers/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb/vehicles/dddddddd-dddd-dddd-dddd-dddddddddd02/ffffffff-ffff-ffff-ffff-fffffffffff2.jpg',
    'f150-driver-side.jpg',
    'driver_side',
    1,
    '00000000-0000-0000-0000-000000000004'
  )
on conflict (id) do update
set
  dealer_id = excluded.dealer_id,
  vehicle_id = excluded.vehicle_id,
  storage_path = excluded.storage_path,
  original_filename = excluded.original_filename,
  label = excluded.label,
  sort_index = excluded.sort_index,
  uploaded_by = excluded.uploaded_by;
