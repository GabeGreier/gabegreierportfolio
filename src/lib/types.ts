export type Project = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  problem_goal: string;
  what_built: string;
  tools_stack: string[];
  challenges: string;
  learnings: string;
  github_url: string | null;
  live_url: string | null;
  cover_image_url: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectImage = {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  created_at: string;
};

export type Visual = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  shot_date: string | null;
  created_at: string;
  updated_at: string;
};
