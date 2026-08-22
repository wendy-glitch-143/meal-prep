export function parseVideo(raw) {
  if (!raw || !String(raw).trim()) return null;

  let href;
  try {
    href = new URL(String(raw).trim());
  } catch {
    return null;
  }

  const host = href.hostname.replace(/^www\./, '').toLowerCase();

  if (host === 'youtu.be') {
    const id = href.pathname.split('/').filter(Boolean)[0];
    return id ? { source: 'YouTube', embed: `https://www.youtube.com/embed/${id}`, tall: false } : null;
  }

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const id =
      href.searchParams.get('v') ||
      href.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
    const tall = href.pathname.includes('/shorts/');
    return id ? { source: 'YouTube', embed: `https://www.youtube.com/embed/${id}`, tall } : null;
  }

  if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
    const id = href.pathname.match(/\/video\/(\d+)/)?.[1];
    return id ? { source: 'TikTok', embed: `https://www.tiktok.com/embed/v2/${id}`, tall: true } : null;
  }

  if (host === 'instagram.com' || host === 'instagr.am') {
    const code = href.pathname.match(/\/(?:reel|reels|p|tv)\/([^/?]+)/)?.[1];
    return code
      ? { source: 'Instagram', embed: `https://www.instagram.com/reel/${code}/embed`, tall: true }
      : null;
  }

  if (host === 'facebook.com' || host === 'fb.com' || host === 'fb.watch' || host === 'm.facebook.com' || host.endsWith('.facebook.com')) {
    return {
      source: 'Facebook',
      embed: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(href.href)}&show_text=0&width=560`,
      tall: href.pathname.includes('/reel'),
    };
  }

  return null;
}
