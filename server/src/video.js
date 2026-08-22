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
    return Boolean(href.pathname.split('/').filter(Boolean)[0]);
  }
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    return Boolean(href.searchParams.get('v') || href.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/));
  }
  if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
    return Boolean(href.pathname.match(/\/video\/(\d+)/));
  }
  if (host === 'instagram.com' || host === 'instagr.am') {
    return Boolean(href.pathname.match(/\/(?:reel|reels|p|tv)\/([^/?]+)/));
  }
  if (host === 'facebook.com' || host === 'fb.com' || host === 'fb.watch' || host === 'm.facebook.com' || host.endsWith('.facebook.com')) {
    return true;
  }
  return false;
}
