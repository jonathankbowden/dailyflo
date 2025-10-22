# HabitFlow - Simple Habit Tracking Website

A clean and intuitive habit tracking web application built with vanilla HTML, CSS, and JavaScript.

## Features

### 🎯 Core Functionality
- **Easy Habit Creation**: Add new habits with categories
- **One-Click Tracking**: Simple check/uncheck system for daily completion
- **Streak Tracking**: Monitor current and longest streaks
- **Progress Visualization**: Visual progress bars and weekly charts
- **Local Storage**: All data persists in your browser

### 📊 Analytics & Stats
- Total habits count
- Daily completion status
- Longest streak achievements
- Weekly completion rates
- 30-day completion percentages
- Interactive progress charts

### 🎨 Design Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean interface following 2025 design trends
- **Visual Feedback**: Smooth animations and hover effects
- **Category Icons**: Emoji-based categorization system
- **Empty State**: Helpful onboarding for new users

## File Structure

```
/
├── index.html          # Landing page
├── app.html           # Main dashboard
├── css/
│   └── styles.css     # All styling and responsive design
├── js/
│   └── app.js         # Habit management logic
├── images/
│   └── mockups/       # SVG illustrations and icons
└── README.md          # Documentation
```

## Usage

1. **Getting Started**: Open `index.html` in any modern web browser
2. **Add Habits**: Click "Get Started" to go to the dashboard
3. **Create Your First Habit**: Click "Add New Habit" and fill in the details
4. **Track Progress**: Click "Mark Done" to complete habits each day
5. **View Analytics**: Check your stats and weekly progress chart

## Categories

- 💊 **Health**: Medical, wellness, and health-related habits
- 🏃‍♂️ **Fitness**: Exercise, sports, and physical activities
- 📈 **Productivity**: Work, organization, and efficiency habits
- 🧘 **Mindfulness**: Meditation, reflection, and mental wellness
- 📚 **Learning**: Education, reading, and skill development
- ⭐ **Other**: Any other custom habits

## Data Storage

All habit data is stored locally in your browser using the `localStorage` API. This means:
- ✅ No server required - works offline
- ✅ Data persists between sessions
- ✅ Privacy-focused - data stays on your device
- ⚠️ Data is browser-specific
- ⚠️ Clearing browser data will remove habits

## Browser Compatibility

Works on all modern browsers including:
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers

## Customization

### Adding New Categories
Edit the `getCategoryEmoji()` function in `js/app.js`:

```javascript
getCategoryEmoji(category) {
    const emojis = {
        health: '💊',
        fitness: '🏃‍♂️',
        yourcategory: '🎯', // Add your emoji here
        // ...
    };
    return emojis[category] || '⭐';
}
```

### Styling Changes
Modify CSS custom properties in `css/styles.css`:

```css
:root {
    --primary-color: #3b82f6;     /* Main brand color */
    --success-color: #10b981;     /* Completion color */
    --background-color: #f8fafc;  /* Page background */
    /* ... */
}
```

## Development

No build process required! Simply:

1. Clone or download the files
2. Open `index.html` in a browser
3. Make changes to HTML, CSS, or JavaScript
4. Refresh to see updates

## License

This project is open source and available under the MIT License.

---

Start building better habits today with HabitFlow! 🌟# dailyflo
