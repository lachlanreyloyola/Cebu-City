const FALLBACK_MAP: Record<string, string> = {
  // Falls
  "kawasanfalls.jpg": "https://i.imgur.com/XB5qYea.jpeg",
  "aguinidfalls.jpg": "https://i.imgur.com/mmaTgkI.jpeg",
  "inambakanfalls.jpg": "https://i.imgur.com/biURrgN.jpeg",
  "mantayupanfalls.jpg": "https://i.imgur.com/rAgMfwC.jpeg",
  "binalayanfalls.jpg": "https://i.imgur.com/UeLkpsw.jpeg",
  "binalayanhiddenfalls.jpg": "https://i.imgur.com/UeLkpsw.jpeg",
  "cambaisfalls.jpg": "https://i.imgur.com/w6du2IH.jpeg",
  "daofalls.jpg": "https://i.imgur.com/wmeEOy6.jpeg",
  "tumalogfalls.jpg": "https://i.imgur.com/lJoHeJg.jpeg",
  "kabutonganfalls.jpg": "https://i.imgur.com/ZA1GF3Q.jpeg",
  "montanezafalls.jpg": "https://i.imgur.com/HDrQIUE.jpeg",
  "kabangfalls.jpg": "https://i.imgur.com/3Y5Nugw.jpeg",

  // Islands
  "mactanisland.jpg": "https://i.imgur.com/pJCR3i0.jpeg",
  "bantayanisland.jpg": "https://i.imgur.com/7kCwcWs.jpeg",
  "malapascuaisland.jpg": "https://i.imgur.com/ee7R3xg.jpeg",
  "tulangdiotisland.jpg": "https://i.imgur.com/Q89wmnb.jpeg",
  "olangoisland.jpg": "https://i.imgur.com/GJqPr37.jpeg",
  "sumilonisland.jpg": "https://i.imgur.com/YOD7onq.jpeg",
  "gilutonganisland.jpg": "https://i.imgur.com/NUEuQPW.jpeg",
  "caohaganisland.jpg": "https://i.imgur.com/G7gpFgI.jpeg",
  "pandanonisland.jpg": "https://i.imgur.com/5l97rXB.jpeg",
  "pescadorisland.jpg": "https://i.imgur.com/SZC80mg.jpeg",
  "capitancilloisland.jpg": "https://i.imgur.com/XbMIKib.jpeg",
  "carnazaisland.jpg": "https://i.imgur.com/cXxhQWy.jpeg",
  "gibitngilisland.jpg": "https://i.imgur.com/5cFTrjK.jpeg",

  // Beaches
  "tingkobeach.jpg": "https://i.imgur.com/UZNaHzl.jpeg",
  "sanremigiobeach.jpg": "https://i.imgur.com/SipOsE0.jpeg",
  "basdakubeach.jpg": "https://i.imgur.com/wQ8xchF.jpeg",
  "panagsamabeach.jpg": "https://i.imgur.com/wQ8xchF.jpeg",
  "hiddenbeach.jpg": "https://i.imgur.com/bWZtg14.jpeg",
  "hiddenbeachdaw.jpg": "https://i.imgur.com/bWZtg14.jpeg",
  "santafebeach.jpg": "https://i.imgur.com/PF8mTnb.jpeg",
  "lambugbeach.jpg": "https://i.imgur.com/OEl3yNu.jpeg",
  "lambugwhitesandextension.jpg": "https://i.imgur.com/gPq0oLO.jpeg",
  "lambugwhitesandextensions.jpg": "https://i.imgur.com/gPq0oLO.jpeg",

  // Mountains
  "osmenapeak.jpg": "https://i.imgur.com/vtRik8G.jpeg",
  "casinopeak.jpg": "https://i.imgur.com/HGwlQ3i.jpeg",
  "mt_naupa.jpg": "https://i.imgur.com/p74trHM.jpeg",
  "mtnaupa.jpg": "https://i.imgur.com/p74trHM.jpeg",
  "mtmanunggal.jpg": "https://i.imgur.com/KxUIc43.png",
  "mtmanunggal.png": "https://i.imgur.com/KxUIc43.png",
  "kandungawpeak.jpg": "https://i.imgur.com/K4w2cZL.png",
  "kandungawpeak.png": "https://i.imgur.com/K4w2cZL.png",
  "mount_kang-irag.jpg": "https://i.imgur.com/Hw8dWl2.jpeg",
  "mtkangirag.jpg": "https://i.imgur.com/Hw8dWl2.jpeg",

  // Other Attractions
  "magellanscross.jpg": "https://i.imgur.com/ScI7CwB.jpeg",
  "magellancross.jpg": "https://i.imgur.com/ScI7CwB.jpeg",
  "basilicasanto-nino.jpg": "https://i.imgur.com/6IV8Fz8.jpeg",
  "basilicasantonino.jpg": "https://i.imgur.com/6IV8Fz8.jpeg",
  "basilicaminordelsantonino.jpg": "https://i.imgur.com/6IV8Fz8.jpeg",
  "fortsanpedro.jpg": "https://i.imgur.com/RcktkO5.jpeg",
  "templeofleah.jpg": "https://i.imgur.com/qZIryen.jpeg",
  "siraogarden.jpg": "https://i.imgur.com/AjQNK9N.jpeg",
  "taoisttemple.jpg": "https://i.imgur.com/848py3j.jpeg",
  "10000roses.jpg": "https://i.imgur.com/Y3JaBIi.jpeg",
  "10kroses.jpg": "https://i.imgur.com/Y3JaBIi.jpeg",
  "cebuoceanpark.jpg": "https://i.imgur.com/ZbXp9q1.jpeg",
  "heritagemonument.jpg": "https://i.imgur.com/6jfAock.jpeg",
  "heritageofcebumonument.jpg": "https://i.imgur.com/6jfAock.jpeg",

  // Global / Map / Background
  "photo-1559592413-7cec4d0cae2b.jpg": "https://i.imgur.com/3vqKAbM.jpeg",
  "cebumap.jpg": "https://i.imgur.com/WEYEaeJ.jpeg",
  "cebu map.jpg": "https://i.imgur.com/WEYEaeJ.jpeg"
};

export function resolveImageUrl(url: string): string {
  if (!url) return '';
  
  let filename = '';
  if (url.includes('\\') || url.includes('/') || url.startsWith('C:')) {
    const parts = url.split(/[\\/]/);
    filename = parts[parts.length - 1];
  } else {
    filename = url;
  }
  
  filename = filename.toLowerCase().trim();
  
  if (FALLBACK_MAP[filename]) {
    return FALLBACK_MAP[filename];
  }
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  return `https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80`;
}
