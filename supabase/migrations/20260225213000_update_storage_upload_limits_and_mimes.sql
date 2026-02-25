update storage.buckets
set
  file_size_limit = 15728640,
  allowed_mime_types = array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif']
where id in ('visuals', 'project-images');
