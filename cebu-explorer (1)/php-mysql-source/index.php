<?php
require_once 'db.php';
session_start();

$isLoggedIn = isset($_SESSION['user_id']);
$userName = $isLoggedIn ? $_SESSION['user_name'] : '';
$userRole = $isLoggedIn ? $_SESSION['user_role'] : '';

$db = getDB();
$destinations = [];
$errorMsg = '';

// Load destinations dynamically from database
try {
    $stmt = $db->query("SELECT * FROM destinations ORDER BY name ASC");
    $destinations = $stmt->fetchAll();
} catch (PDOException $e) {
    $errorMsg = "Database content offline. Loading backup assets.";
    error_log("Index Load Error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Cebu Explorer - Cebu City Travel Portal</title>
<meta name="description" content="Explore Cebu's beaches, waterfalls, islands, mountains and cultural treasures." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<style>
:root{
  --ocean-900:#063b54;
  --ocean-700:#0a6b8a;
  --ocean-500:#1aa3c4;
  --ocean-300:#7ed3e3;
  --sand-50:#fdfaf3;
  --sand-100:#f6efe1;
  --sand-200:#ead9b8;
  --palm-700:#1f6f4a;
  --palm-500:#3aa172;
  --palm-300:#9ad5b6;
  --sun:#f6b042;
  --coral:#ff6f61;
  --ink:#0c2230;
  --muted:#5b6b76;
  --white:#ffffff;
  --radius:18px;
  --radius-sm:12px;
  --shadow-sm:0 4px 14px rgba(6,59,84,.08);
  --shadow-md:0 12px 30px rgba(6,59,84,.14);
  --shadow-lg:0 25px 60px rgba(6,59,84,.22);
  --grad-hero:linear-gradient(135deg, rgba(6,59,84,.78) 0%, rgba(10,107,138,.55) 50%, rgba(26,163,196,.45) 100%);
  --grad-ocean:linear-gradient(135deg,var(--ocean-700),var(--ocean-500));
  --grad-sand:linear-gradient(135deg,#fffaf0,#f6efe1);
  --trans:all .35s cubic-bezier(.2,.7,.2,1);
  --font-display:"Playfair Display", Georgia, serif;
  --font-body:"Poppins", system-ui, sans-serif;
}

*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  font-family:var(--font-body);
  color:var(--ink);
  background:var(--sand-50);
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
button{font:inherit;cursor:pointer;border:none;background:none}

.container{width:min(1200px,92%);margin-inline:auto}

.nav{
  position:sticky;top:0;z-index:50;
  backdrop-filter:saturate(140%) blur(14px);
  background:rgba(253,250,243,.82);
  border-bottom:1px solid rgba(6,59,84,.08);
}
.nav-inner{display:flex;align-items:center;justify-content:space-between;padding:18px 0}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:1.15rem;color:var(--ocean-900)}
.brand-mark{
  width:38px;height:38px;border-radius:50%;
  background:var(--grad-ocean);
  display:grid;place-items:center;color:#fff;font-weight:800;
  box-shadow:var(--shadow-sm);
}
.nav ul{display:flex;gap:28px;list-style:none}
.nav ul a{font-weight:500;color:var(--ink);position:relative;transition:var(--trans)}
.nav ul a::after{content:"";position:absolute;left:0;bottom:-6px;width:0;height:2px;background:var(--ocean-500);transition:var(--trans)}
.nav ul a:hover{color:var(--ocean-700)}
.nav ul a:hover::after{width:100%}
.nav-cta{
  padding:10px 18px;border-radius:999px;background:var(--grad-ocean);color:#fff;font-weight:600;
  box-shadow:var(--shadow-sm);transition:var(--trans);
}
.nav-cta:hover{transform:translateY(-2px);box-shadow:var(--shadow-md)}
@media(max-width:780px){ .nav ul{display:none} }

.hero{
  position:relative;min-height:92vh;display:grid;place-items:center;color:#fff;text-align:center;
  background:
    var(--grad-hero),
    url("https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1800&q=80") center/cover no-repeat;
  overflow:hidden;
}
.hero::before{
  content:"";position:absolute;inset:auto 0 0 0;height:120px;
  background:linear-gradient(to top,var(--sand-50),transparent);
}
.hero-content{position:relative;z-index:2;padding:0 20px;max-width:900px}
.hero-eyebrow{
  display:inline-block;padding:8px 16px;border-radius:999px;
  background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);
  backdrop-filter:blur(8px);font-size:.8rem;letter-spacing:.18em;text-transform:uppercase;
  margin-bottom:24px;
}
.hero h1{
  font-family:var(--font-display);
  font-size:clamp(2.6rem,6vw,5rem);
  line-height:1.05;font-weight:800;margin-bottom:18px;
  text-shadow:0 6px 30px rgba(0,0,0,.35);
}
.hero h1 em{color:var(--sun);font-style:normal}
.hero p{font-size:clamp(1rem,1.4vw,1.2rem);opacity:.95;max-width:680px;margin:0 auto 36px}
.hero-cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.btn{
  display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:999px;
  font-weight:600;letter-spacing:.02em;transition:var(--trans);
}
.btn-primary{background:var(--sun);color:var(--ocean-900);box-shadow:var(--shadow-md)}
.btn-primary:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg);background:#ffc362}
.btn-ghost{border:1.5px solid rgba(255,255,255,.7);color:#fff}
.btn-ghost:hover{background:#fff;color:var(--ocean-900)}

.scroll-ind{
  position:absolute;bottom:32px;left:50%;transform:translateX(-50%);z-index:2;
  width:28px;height:46px;border:2px solid rgba(255,255,255,.7);border-radius:14px;
  display:grid;place-items:start center;padding-top:8px;
}
.scroll-ind::after{
  content:"";width:4px;height:8px;border-radius:2px;background:#fff;
  animation:scroll 1.6s infinite;
}
@keyframes scroll{0%{transform:translateY(0);opacity:1}80%{transform:translateY(16px);opacity:0}100%{opacity:0}}

section{padding:90px 0}
.section-head{text-align:center;max-width:720px;margin:0 auto 50px}
.section-head .eyebrow{
  color:var(--ocean-500);font-weight:600;letter-spacing:.25em;
  text-transform:uppercase;font-size:.78rem;margin-bottom:12px;
}
.section-head h2{
  font-family:var(--font-display);font-size:clamp(2rem,3.6vw,3rem);
  color:var(--ocean-900);line-height:1.15;margin-bottom:14px;
}
.section-head p{color:var(--muted);font-size:1.05rem}

.explore{background:var(--sand-50)}

.search-bar{
  display:flex;align-items:center;gap:12px;
  background:#fff;border:1px solid rgba(6,59,84,.1);
  border-radius:999px;padding:10px 18px;max-width:560px;margin:0 auto 36px;
  box-shadow:var(--shadow-sm);transition:var(--trans);
}
.search-bar:focus-within,.search-bar:hover{box-shadow:var(--shadow-md);border-color:var(--ocean-300)}
.search-bar input{border:none;outline:none;flex:1;font:inherit;color:var(--ink);background:transparent}
.search-bar .icon{color:var(--ocean-500);font-size:1.1rem}
.search-hint{text-align:center;color:var(--muted);font-size:.85rem;margin-top:-20px;margin-bottom:36px}

.tab-inputs{position:absolute;opacity:0;pointer-events:none}
.tabs{
  display:flex;flex-wrap:wrap;justify-content:center;gap:10px;
  margin-bottom:40px;
}
.tabs label{
  padding:11px 22px;border-radius:999px;background:#fff;
  border:1.5px solid rgba(6,59,84,.1);
  font-weight:500;color:var(--ocean-900);cursor:pointer;
  transition:var(--trans);user-select:none;
  display:inline-flex;align-items:center;gap:8px;
}
.tabs label:hover{transform:translateY(-2px);box-shadow:var(--shadow-sm);border-color:var(--ocean-300)}

#tab-falls:checked     ~ .tabs label[for="tab-falls"],
#tab-islands:checked   ~ .tabs label[for="tab-islands"],
#tab-beaches:checked   ~ .tabs label[for="tab-beaches"],
#tab-attract:checked   ~ .tabs label[for="tab-attract"],
#tab-mountains:checked ~ .tabs label[for="tab-mountains"]{
  background:var(--grad-ocean);color:#fff;border-color:transparent;
  box-shadow:var(--shadow-md);transform:translateY(-2px);
}

.panel{display:none;animation:fade .5s ease}
@keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
#tab-falls:checked     ~ .panels #panel-falls,
#tab-islands:checked   ~ .panels #panel-islands,
#tab-beaches:checked   ~ .panels #panel-beaches,
#tab-attract:checked   ~ .panels #panel-attract,
#tab-mountains:checked ~ .panels #panel-mountains{display:block}

.grid{
  display:grid;gap:28px;
  grid-template-columns:repeat(auto-fill,minmax(290px,1fr));
}
.card{
  background:#fff;border-radius:var(--radius);overflow:hidden;
  box-shadow:var(--shadow-sm);transition:var(--trans);
  display:flex;flex-direction:column;position:relative;
  border:1px solid rgba(6,59,84,.05);
}
.card:hover{transform:translateY(-8px);box-shadow:var(--shadow-lg)}
.card-img{
  position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--sand-200);
}
.card-img img{width:100%;height:100%;object-fit:cover;transition:transform .8s ease}
.card:hover .card-img img{transform:scale(1.08)}
.card-img::after{
  content:"";position:absolute;inset:0;
  background:linear-gradient(to top,rgba(6,59,84,.45),transparent 55%);
}
.badge{
  position:absolute;top:14px;left:14px;z-index:2;
  padding:6px 12px;border-radius:999px;font-size:.72rem;
  background:rgba(255,255,255,.92);color:var(--ocean-900);
  font-weight:600;letter-spacing:.08em;text-transform:uppercase;
  backdrop-filter:blur(6px);
}

.card-body{padding:22px;display:flex;flex-direction:column;flex:1;gap:10px}
.card-body h3{font-family:var(--font-display);font-size:1.35rem;color:var(--ocean-900);line-height:1.2}
.card-loc{display:flex;align-items:center;gap:6px;color:var(--ocean-500);font-size:.85rem;font-weight:500}
.card-desc{color:var(--muted);font-size:.94rem}

.more{margin-top:6px}
.more input{position:absolute;opacity:0;pointer-events:none}
.more-content{
  max-height:0;overflow:hidden;transition:max-height .5s ease,opacity .35s ease;opacity:0;
  background:var(--grad-sand);border-radius:12px;
  padding:0 14px;margin-top:0;
}
.more-content p{font-size:.9rem;color:var(--ink);padding:14px 0}
.more-content strong{color:var(--palm-700)}
.more input:checked ~ .more-content{max-height:300px;opacity:1;margin-top:10px}
.more-label{
  display:inline-flex;align-items:center;gap:6px;color:var(--ocean-700);
  font-weight:600;font-size:.88rem;cursor:pointer;margin-top:auto;padding-top:8px;
  transition:var(--trans);
}
.more-label:hover{color:var(--ocean-500)}
.more-label .chev{transition:transform .35s ease;display:inline-block}
.more input:checked ~ .more-label .chev{transform:rotate(180deg)}
.more input:checked ~ .more-label .lbl-more{display:none}
.more input:checked ~ .more-label .lbl-less{display:inline}
.more .lbl-less{display:none}

.about{
  background:linear-gradient(180deg,#fff,var(--sand-50));
}
.about-grid{
  display:grid;grid-template-columns:1.1fr 1fr;gap:60px;align-items:center;
}
@media(max-width:900px){.about-grid{grid-template-columns:1fr}}
.about-img{
  position:relative;border-radius:var(--radius);overflow:hidden;
  aspect-ratio:4/5;box-shadow:var(--shadow-lg);
}
.about-img img{width:100%;height:100%;object-fit:cover;transition:transform .8s ease}
.about-img:hover img{transform:scale(1.05)}
.about-img::after{
  content:"Queen City of the South";
  position:absolute;bottom:20px;left:20px;right:20px;
  padding:14px 18px;border-radius:12px;
  background:rgba(255,255,255,.94);color:var(--ocean-900);
  font-family:var(--font-display);font-size:1.1rem;font-weight:700;
}
.about h2{font-family:var(--font-display);font-size:clamp(2rem,3.2vw,2.8rem);color:var(--ocean-900);margin-bottom:20px;line-height:1.15}
.about p{color:var(--muted);margin-bottom:16px;font-size:1.02rem}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:32px}
.stat{
  background:#fff;padding:20px;border-radius:var(--radius-sm);
  text-align:center;box-shadow:var(--shadow-sm);transition:var(--trans);
  border:1px solid rgba(6,59,84,.06);
}
.stat:hover{transform:translateY(-4px);box-shadow:var(--shadow-md)}
.stat .num{font-family:var(--font-display);font-size:1.8rem;color:var(--ocean-700);font-weight:800}
.stat .lbl{font-size:.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:.12em;margin-top:4px}

footer{
  background:linear-gradient(135deg,var(--ocean-900),#04293a);
  color:#cfe6ef;padding:70px 0 30px;
}
.foot-grid{
  display:grid;grid-template-columns:2fr 1fr 1fr;gap:50px;
}
@media(max-width:780px){.foot-grid{grid-template-columns:1fr;gap:30px}}
footer h4{color:#fff;margin-bottom:14px;font-family:var(--font-display);font-size:1.2rem}
footer p{font-size:.92rem;opacity:.85;max-width:380px}
footer ul{list-style:none;display:flex;flex-direction:column;gap:8px}
footer ul a{transition:var(--trans);font-size:.92rem;opacity:.85}
footer ul a:hover{color:var(--sun);opacity:1;padding-left:4px}
.socials{display:flex;gap:12px;margin-top:18px}
.socials a{
  width:40px;height:40px;border-radius:50%;
  background:rgba(255,255,255,.08);display:grid;place-items:center;
  transition:var(--trans);font-weight:700;color:#fff;
}
.socials a:hover{background:var(--sun);color:var(--ocean-900);transform:translateY(-3px)}
.foot-base{
  margin-top:50px;padding-top:24px;border-top:1px solid rgba(255,255,255,.1);
  display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;
  font-size:.85rem;opacity:.75;
}
::selection{background:var(--sun);color:var(--ocean-900)}

.search-container {
  max-width: 560px;
  margin: 0 auto 36px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
.btn-surprise {
  background: var(--grad-sand);
  color: var(--ocean-900);
  border: 1.5px solid var(--ocean-300);
  padding: 10px 20px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-sm);
  transition: var(--trans);
}
.btn-surprise:hover {
  background: var(--white);
  border-color: var(--sun);
  transform: translateY(-2px) scale(1.03);
  box-shadow: var(--shadow-md);
}

@keyframes highlightFlash {
  0% {
    box-shadow: 0 0 0 0px rgba(246, 176, 66, 0.8), var(--shadow-lg);
    transform: scale(1.03);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(246, 176, 66, 0), var(--shadow-lg);
    transform: scale(1.03);
  }
  100% {
    box-shadow: var(--shadow-sm);
    transform: scale(1);
  }
}
.card-highlighted {
  animation: highlightFlash 1.5s cubic-bezier(.2, .7, .2, 1) forwards;
  border-color: var(--sun) !important;
  z-index: 10;
}
.btn-book-it {
    display: inline-block;
    background: var(--grad-ocean);
    color: #fff;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    text-align: center;
    margin-top: 10px;
    transition: var(--trans);
}
.btn-book-it:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}
</style>
</head>
<body>

<header class="nav">
  <div class="container nav-inner">
    <a href="#top" class="brand">
      <span class="brand-mark">C</span> Cebu Explorer
    </a>
    <ul>
      <li><a href="#explore">Explore</a></li>
      <li><a href="#about">About Cebu</a></li>
    </ul>
    <?php if ($isLoggedIn): ?>
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="font-size: 0.9rem; font-weight: 500;">Hi, <?= htmlspecialchars($userName) ?></span>
        <a href="dashboard.php" class="nav-cta">Go to Dashboard →</a>
      </div>
    <?php else: ?>
      <a href="login.php" class="nav-cta">Login / Register →</a>
    <?php endif; ?>
  </div>
</header>

<section id="top" class="hero">
  <div class="hero-content">
    <span class="hero-eyebrow">Philippines · Visayas</span>
    <h1 class="hero-title">
        Discover the Beauty of<br/>
        <em>Cebu City</em>
      </h1>
    <p>Discover the breathtaking destinations, historical landmarks, and unforgettable experiences that Cebu City has to offer.</p>
    <div class="hero-cta">
      <a href="#explore" class="btn btn-primary">Start Exploring →</a>
      <a href="#about" class="btn btn-ghost">About Cebu</a>
    </div>
  </div>
  <a href="#explore" class="scroll-ind" aria-label="Scroll down"></a>
</section>

<section id="explore" class="explore">
  <div class="container">
    <div class="section-head">
      <div class="eyebrow">Plan Your Journey</div>
      <h2>Where will Cebu take you?</h2>
      <p>Switch between categories and uncover the island's most unforgettable destinations.</p>
    </div>

    <div class="search-container">
      <div class="search-bar" style="margin-bottom: 0; width: 100%;">
        <span class="icon">⌕</span>
        <input type="text" id="dest-search" placeholder="Search a destination... e.g. Kawasan Falls, Bantayan Island" />
        <span style="font-size:.75rem;color:var(--muted)">⌘K</span>
      </div>
      
      <button type="button" class="btn-surprise" id="btn-surprise">
        <span>🎲</span> Surprise Me with an Adventure!
      </button>
    </div>
    <p class="search-hint" id="search-hint">Tip — use the category tabs below to filter destinations</p>

    <input class="tab-inputs" type="radio" name="cat" id="tab-falls" checked />
    <input class="tab-inputs" type="radio" name="cat" id="tab-islands" />
    <input class="tab-inputs" type="radio" name="cat" id="tab-beaches" />
    <input class="tab-inputs" type="radio" name="cat" id="tab-attract" />
    <input class="tab-inputs" type="radio" name="cat" id="tab-mountains" />

    <div class="tabs">
        <label for="tab-falls"><span class="emoji">⛰️</span> Cebu Falls</label>
        <label for="tab-islands"><span class="emoji">🏝️</span> Cebu Islands</label>
        <label for="tab-beaches"><span class="emoji">🏖️</span> Cebu Beaches</label>
        <label for="tab-mountains"><span class="emoji">🧗</span> Hiking Mountains</label>
        <label for="tab-attract"><span class="emoji">🏛️</span> Other Attractions</label>
    </div>

    <div class="panels">
      <?php
      $categories = ['falls', 'islands', 'beaches', 'mountains', 'attract'];
      foreach ($categories as $cat):
      ?>
        <div class="panel" id="panel-<?= $cat ?>">
          <div class="grid">
            <?php
            $count = 0;
            foreach ($destinations as $dest):
                if ($dest['category'] !== $cat) continue;
                $count++;
            ?>
              <article class="card" data-id="<?= htmlspecialchars($dest['id']) ?>">
                <div class="card-img">
                  <span class="badge"><?= htmlspecialchars($dest['badge']) ?></span>
                  <img src="<?= htmlspecialchars($dest['image_url']) ?>" alt="<?= htmlspecialchars($dest['name']) ?>"/>
                </div>
                <div class="card-body">
                  <h3><?= htmlspecialchars($dest['name']) ?></h3>
                  <div class="card-loc">
                    <a href="<?= htmlspecialchars($dest['maps_url']) ?>" target="_blank" title="View on Google Maps">
                      📍 <?= htmlspecialchars($dest['location']) ?>
                    </a>
                  </div>
                  <p class="card-desc"><?= htmlspecialchars($dest['description']) ?></p>
                  <div class="more">
                    <input type="checkbox" id="m-<?= htmlspecialchars($dest['id']) ?>"/>
                    <div class="more-content">
                      <p><strong>Why visit:</strong> <?= htmlspecialchars($dest['why_visit']) ?></p>
                    </div>
                    <label for="m-<?= htmlspecialchars($dest['id']) ?>" class="more-label">
                      <span class="lbl-more">Read more</span><span class="lbl-less">Show less</span> <span class="chev">▾</span>
                    </label>
                  </div>
                  
                  <!-- Booking trigger button -->
                  <a href="dashboard.php" class="btn-book-it">Book Travel Reservation →</a>
                </div>
              </article>
            <?php endforeach; ?>
            
            <?php if ($count === 0): ?>
               <p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 40px;">No destinations loaded in this category. Run the SQL script to seed destinations.</p>
            <?php endif; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section id="about" class="about">
  <div class="container about-grid">
    <div class="about-img">
      <img src="https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800&q=80" alt="Cebu landscape"/>
    </div>
    <div>
      <div class="eyebrow" style="color:var(--ocean-500);font-weight:600;letter-spacing:.25em;text-transform:uppercase;font-size:.78rem;margin-bottom:12px">About Cebu</div>
      <h2>The Queen City of the South</h2>
      <p>Cebu is the heart of the Visayas — a province where 500 years of history meets pristine reefs, mossy peaks and powder-white islands.</p>
      <p>It's the birthplace of Philippine Christianity, the launchpad for the country's most iconic dive sites, and a culinary capital famous for lechon. Few places blend nature, heritage and adventure quite so seamlessly.</p>
      <p>Whether you're chasing sardines underwater, climbing a knife-edge peak at sunrise, or wandering through Spanish-era plazas — Cebu meets you with warmth, color, and stories.</p>
      <div class="stats">
        <div class="stat"><div class="num">167</div><div class="lbl">Islands</div></div>
        <div class="stat"><div class="num">500+</div><div class="lbl">Years of History</div></div>
        <div class="stat"><div class="num">∞</div><div class="lbl">Adventures</div></div>
      </div>
    </div>
  </div>
</section>

<footer id="contact">
  <div class="container">
    <div class="foot-grid">
      <div>
        <h4>Cebu Explorer</h4>
        <p>Discover. Explore. Experience Cebu. Your interactive guide to the most beautiful corners of the Queen City of the South.</p>
        <div class="socials">
          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="Instagram">ig</a>
          <a href="#" aria-label="Twitter">x</a>
          <a href="#" aria-label="YouTube">▶</a>
        </div>
      </div>
      <div>
        <h4>Explore</h4>
        <ul>
          <li><a href="#explore">Waterfalls</a></li>
          <li><a href="#explore">Islands</a></li>
          <li><a href="#explore">Beaches</a></li>
          <li><a href="#explore">Mountains</a></li>
          <li><a href="#explore">Attractions</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="#about">About Cebu</a></li>
          <li><a href="#">Travel Tips</a></li>
          <li><a href="#">Privacy</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-base">
      <div></div>
      <div>Made with 💙 in the Philippines</div>
    </div>
  </div>
</footer>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('dest-search');
  const surpriseBtn = document.getElementById('btn-surprise');
  const cards = document.querySelectorAll('.card');
  const panels = document.querySelectorAll('.panel');
  const searchHint = document.getElementById('search-hint');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query.length > 0) {
      panels.forEach(panel => panel.style.display = 'block');
      searchHint.textContent = `Showing matches for "${e.target.value}"`;

      cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const location = card.querySelector('.card-loc').textContent.toLowerCase();

        if (title.includes(query) || location.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    } else {
      panels.forEach(panel => panel.removeAttribute('style'));
      cards.forEach(card => card.style.display = '');
      searchHint.innerHTML = 'Tip — use the category tabs below to filter destinations';
    }
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  surpriseBtn.addEventListener('click', () => {
    cards.forEach(card => card.classList.remove('card-highlighted'));

    if(searchInput.value) {
      searchInput.value = '';
      panels.forEach(panel => panel.removeAttribute('style'));
      cards.forEach(card => card.style.display = '');
      searchHint.innerHTML = 'Tip — use the category tabs below to filter destinations';
    }

    const randomIndex = Math.floor(Math.random() * cards.length);
    const selectedCard = cards[randomIndex];

    const parentPanel = selectedCard.closest('.panel');
    
    if (parentPanel) {
      const panelId = parentPanel.id;
      const targetRadioId = panelId.replace('panel-', 'tab-');
      const matchingRadio = document.getElementById(targetRadioId);
      
      if (matchingRadio) {
        matchingRadio.checked = true;
      }
    }

    setTimeout(() => {
      selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      selectedCard.classList.add('card-highlighted');
    }, 100); 
  });
});
</script>
</body>
</html>
