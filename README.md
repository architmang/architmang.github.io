# Portfolio — Quick Setup Guide

## Files
```
portfolio/
├── index.html      ← All sections, comments mark every REPLACE point
├── style.css       ← Design tokens in :root — change colors here first
├── script.js       ← Typewriter roles array at the top
├── resume.pdf      ← REPLACE with your actual PDF
└── images/         ← Optional: add profile.jpg and project screenshots
```

---

## 5-minute checklist (search for "REPLACE" in each file)

### index.html
| What | Where | Replace with |
|------|-------|--------------|
| Page `<title>` | line 8 | Your name and role |
| Favicon letter | line 11 | Your initial |
| Profile photo | hero `<img src=...>` | `images/profile.jpg` or keep pravatar URL |
| Avatar badge | `.avatar-badge` | Your university/company |
| Hero bio | `.hero-bio` | Your one-liner |
| Social links | `.hero-socials` | Your GitHub, LinkedIn, email, etc. |
| About paragraphs | `.about-text` | Your story |
| Stat numbers | `.stat-card` | Your actual numbers |
| Project cards | 5x `.proj-card` | Title, desc, tech, GitHub link, demo link |
| Project images | `img src="https://picsum.photos/..."` | `images/proj1.png` etc. |
| Contact details | `.contact-details` | Your email, city, links |
| Formspree action | `<form action="...">` | Your Formspree endpoint |
| Footer name | `<footer>` | Your name |

### script.js
- Line 12: `typewriterRoles` array — update titles to match your work

### style.css
- Line 10: `--accent` — change `#a78bfa` to your preferred color
- Line 11: `--accent-2` — secondary accent

---

## Deploy to GitHub Pages

1. Create a repo named exactly: `architmang.github.io`
2. Upload all files (maintain folder structure)
3. Go to Settings → Pages → Source: Deploy from branch → main → / (root)
4. Live at `https://architmang.github.io` in ~2 minutes

## Add real project images
Replace the picsum URLs with local files:
```html
<!-- Before -->
<img src="https://picsum.photos/600/340?random=10" ...>

<!-- After: put proj1.png in the images/ folder -->
<img src="images/proj1.png" ...>
```

## Set up Formspree (contact form)
1. Go to https://formspree.io and sign up (free tier: 50 submissions/month)
2. Create a new form → copy the form ID (looks like `xabcdefg`)
3. In index.html find: `action="https://formspree.io/f/your-form-id"`
4. Replace `your-form-id` with your actual ID
