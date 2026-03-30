do $$
declare
  profile_uuid uuid;
begin
  update public.profiles
  set
    profile_image_path = '/profile.jpg',
    resume_path = '/Naman_Sanadhya_Resume.pdf'
  where slug = 'naman-sanadhya'
  returning id into profile_uuid;
end
$$;
