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
    true,
    true,
    now()::date
  ),
  (
    'Afterglow Coupe',
    'Warm dusk tones and clean reflections.',
    'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=640&q=70',
    true,
    true,
    now()::date
  ),
  (
    'Trackside Red',
    'Compressed telephoto perspective with subtle motion blur.',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=640&q=70',
    true,
    true,
    now()::date
  )
on conflict do nothing;
