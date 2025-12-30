# PoC Days Off Calculator

Calculate the number of working days off per month for employee holidays, excluding weekends and French public holidays.

## Installation

```bash
npm install
```

## Usage

### Web Application (Vue.js)

Start the development server:

```bash
npm run dev
```

Then open your browser at `http://localhost:3000`

### CLI (Optional)

You can still use the CLI version:

```bash
npm run cli 2025-04-27 2025-05-10
```

## Features

- 🎨 Modern Vue.js web interface with beautiful UI
- 📅 Date picker for easy date selection
- 🇫🇷 Fetches French public holidays from the official government API
- 📊 Real-time calculation with loading states
- 🗓️ Automatically handles periods spanning multiple months and years
- 🚫 Excludes weekends (Saturday and Sunday)
- 🎉 Excludes public holidays
- 📈 Detailed monthly breakdown with visual cards

## Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Example Calculation

**Input:** April 27, 2025 to May 10, 2025

**Result:**
- Total: 14 days - 4 weekends - 2 public holidays = **8 working days**
- April 2025: 3 working days
- May 2025: 5 working days
