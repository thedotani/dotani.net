# 03: PowerShell Setup Prompt for Astro + Sanity + Cloudflare

You are a coding agent helping me set up a modern website stack from scratch using PowerShell on Windows.

## Goal
Set up:
- an Astro website
- Git/GitHub version control
- Sanity Studio for CMS
- Cloudflare Pages deployment later
- a clean local development workflow

Do not overcomplicate the setup. Keep it clean, stable, and production-minded.

---

## What has already been done

### 1: Astro project created
I started in:

```powershell
cd D:\Labs\dotani
npm create astro@latest
````

Astro was created with:

* minimal empty template
* dependencies installed
* git initialised

Then I ran:

```powershell
npm run dev
```

Astro started successfully at:

```text
http://localhost:4321/
```

---

### 2: Git repository connected

I checked git status:

```powershell
git status
```

Then I added the GitHub remote:

```powershell
git remote add origin https://github.com/thedotani/dotani.net.git
```

I renamed the branch:

```powershell
git branch -M main
```

I pushed to GitHub:

```powershell
git push -u origin main
```

The repository is now on GitHub and tracking `origin/main`.

Remote confirmed with:

```powershell
git remote -v
```

---

### 3: Sanity Studio created

Then I created Sanity Studio:

```powershell
npm create sanity@latest
```

Setup choices made:

* logged in with GitHub account
* selected existing org: `Dotani [oAecbEcXf]`
* used default dataset configuration
* dataset created successfully
* project name: `dotani.net`
* output path: `D:\Labs\dotani\dotaninet`
* template: `Clean project with no predefined schema types`
* TypeScript: Yes
* package manager: npm

Sanity Studio was successfully created.

---

### 4: Sanity Studio started

I moved into the Studio folder:

```powershell
cd dotaninet
```

Then ran:

```powershell
npm run dev
```

Sanity Studio started successfully at:

```text
http://localhost:3333/
```

---

## Current state

At this point:

* Astro is running locally
* GitHub repo is connected
* Sanity Studio exists and runs locally
* the project is ready for CMS structuring
* Cloudflare Pages deployment will come after the structure is ready

---

## What I want next

Take this setup and continue professionally with:

1. clean project structure
2. Astro ↔ Sanity integration
3. CMS schemas for:

   * site settings
   * header
   * footer
   * pages
   * sections/blocks
   * services
   * portfolio
   * testimonials
   * CTA sections
4. later Cloudflare Pages deployment
5. keep everything modular and maintainable

---

## Important rules

* Do not hardcode content that should live in Sanity
* Do not create messy page files with random static sections
* Do not build a monolithic homepage
* Use reusable section blocks
* Use CMS-driven architecture
* Keep the setup simple, scalable, and editable

---

## Working directories

* Astro project root: `D:\Labs\dotani`
* Sanity Studio project: `D:\Labs\dotani\dotaninet`

---

## Runtime ports

* Astro: `http://localhost:4321/`
* Sanity Studio: `http://localhost:3333/`

```
```
