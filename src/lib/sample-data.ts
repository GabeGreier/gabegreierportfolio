import type { Project, ProjectImage, Visual } from "@/lib/types";

const now = new Date().toISOString();

export const sampleProjects: Project[] = [
  {
    id: "sample-fpga-pedal",
    title: "FPGA Distortion Pedal",
    slug: "fpga-distortion-pedal",
    short_description:
      "A real-time guitar distortion pedal implemented on FPGA with custom DSP signal flow.",
    full_description:
      "This project explored low-latency audio signal processing on FPGA, mapping analog-inspired distortion curves and tone shaping to hardware for immediate response.",
    problem_goal:
      "Build a performant, programmable distortion pedal with deterministic latency and deep control over the tone pipeline.",
    what_built:
      "Designed and tested a Verilog DSP chain, integrated ADC/DAC IO, and created a configurable signal architecture with clipping, EQ, and output shaping blocks.",
    tools_stack: ["Verilog", "FPGA", "Quartus", "Oscilloscope", "PCB Prototyping"],
    challenges:
      "Managing quantization artifacts, balancing clip character with headroom, and keeping latency imperceptible during iterative tone testing.",
    learnings:
      "Gained practical understanding of fixed-point DSP and hardware debugging under real-world audio constraints.",
    github_url: null,
    live_url: null,
    cover_image_url:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80",
    published: true,
    featured: true,
    created_at: now,
    updated_at: now
  },
  {
    id: "sample-ring-rink",
    title: "Ring & Rink",
    slug: "ring-and-rink",
    short_description:
      "A polished React web experience for discovering and organizing local skating events.",
    full_description:
      "Ring & Rink focused on clean information architecture and performant UI patterns to keep discovery fast on mobile and desktop.",
    problem_goal:
      "Create an interface that makes planning skating sessions frictionless while presenting event details clearly.",
    what_built:
      "Built reusable React UI modules, location-aware listings, event detail pages, and a simplified booking flow with reliable responsive behavior.",
    tools_stack: ["React", "TypeScript", "Tailwind CSS", "Vercel"],
    challenges:
      "Maintaining strong responsiveness while keeping the experience lightweight with rich card-based layouts.",
    learnings:
      "Improved front-end system design discipline and component API design for long-term maintainability.",
    github_url: "https://github.com/",
    live_url: "https://example.com",
    cover_image_url:
      "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1400&q=80",
    published: true,
    featured: true,
    created_at: now,
    updated_at: now
  },
  {
    id: "sample-embedded-logger",
    title: "Embedded Telemetry Logger",
    slug: "embedded-telemetry-logger",
    short_description:
      "A compact telemetry system for capturing and visualizing sensor data from test runs.",
    full_description:
      "Designed as a reliability-focused side project, this logger captures real-time sensor values, stores run sessions, and visualizes trends for post-run analysis.",
    problem_goal:
      "Improve repeatability during prototyping by turning ad hoc sensor checks into structured, reviewable data.",
    what_built:
      "Created firmware data pipelines, timestamped buffering logic, and a small dashboard to inspect sessions and outlier behavior.",
    tools_stack: ["C", "Microcontroller", "UART", "React", "Charting"],
    challenges:
      "Synchronizing sensor polling and robust buffering without dropping packets under burst conditions.",
    learnings:
      "Strengthened system-level thinking across firmware, transport, and interface layers.",
    github_url: null,
    live_url: null,
    cover_image_url:
      "https://images.unsplash.com/photo-1581092160607-ee22731ffdb8?auto=format&fit=crop&w=1400&q=80",
    published: true,
    featured: false,
    created_at: now,
    updated_at: now
  }
];

export const sampleProjectImages: ProjectImage[] = [
  {
    id: "img-1",
    project_id: "sample-fpga-pedal",
    image_url:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80",
    alt_text: "FPGA board and pedal prototype",
    sort_order: 0,
    created_at: now
  },
  {
    id: "img-2",
    project_id: "sample-ring-rink",
    image_url:
      "https://images.unsplash.com/photo-1551808525-51a94da548ce?auto=format&fit=crop&w=1400&q=80",
    alt_text: "Ring & Rink app screens",
    sort_order: 0,
    created_at: now
  },
  {
    id: "img-3",
    project_id: "sample-embedded-logger",
    image_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    alt_text: "Embedded telemetry test rig",
    sort_order: 0,
    created_at: now
  }
];

export const sampleVisuals: Visual[] = [
  {
    id: "visual-1",
    title: "Midnight GT",
    description: "Low-angle cinematic roll shot with deep contrast.",
    image_url:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80",
    thumbnail_url:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=640&q=70",
    featured: true,
    published: true,
    shot_date: now,
    created_at: now,
    updated_at: now
  },
  {
    id: "visual-2",
    title: "Afterglow Coupe",
    description: "Warm dusk tones and clean reflections.",
    image_url:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1600&q=80",
    thumbnail_url:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=640&q=70",
    featured: true,
    published: true,
    shot_date: now,
    created_at: now,
    updated_at: now
  },
  {
    id: "visual-3",
    title: "Trackside Red",
    description: "Compressed telephoto perspective with subtle motion blur.",
    image_url:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80",
    thumbnail_url:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=640&q=70",
    featured: true,
    published: true,
    shot_date: now,
    created_at: now,
    updated_at: now
  },
  {
    id: "visual-4",
    title: "Studio Detail",
    description: "Macro bodyline study with controlled highlights.",
    image_url:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80",
    thumbnail_url:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=640&q=70",
    featured: true,
    published: true,
    shot_date: now,
    created_at: now,
    updated_at: now
  },
  {
    id: "visual-5",
    title: "Industrial Night",
    description: "Moody urban set with practical light spill.",
    image_url:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1600&q=80",
    thumbnail_url:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=640&q=70",
    featured: true,
    published: true,
    shot_date: now,
    created_at: now,
    updated_at: now
  },
  {
    id: "visual-6",
    title: "Desert Run",
    description: "Wide composition with warm haze and dynamic stance.",
    image_url:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80",
    thumbnail_url:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=640&q=70",
    featured: true,
    published: true,
    shot_date: now,
    created_at: now,
    updated_at: now
  },
  {
    id: "visual-7",
    title: "Monochrome Sprint",
    description: "High-contrast black and white edit.",
    image_url:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    thumbnail_url:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=640&q=70",
    featured: false,
    published: true,
    shot_date: now,
    created_at: now,
    updated_at: now
  },
  {
    id: "visual-8",
    title: "Harbor Lights",
    description: "Long exposure with subtle glow and shape.",
    image_url:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=80",
    thumbnail_url:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=640&q=70",
    featured: false,
    published: true,
    shot_date: now,
    created_at: now,
    updated_at: now
  }
];
