# ChargeWay - Electric Vehicle Charging Station Website

A modern, responsive static website for an electric vehicle charging station management system with real-time booking, admin management, and customer loyalty program.

## Features

### Customer Features
- **Port-Level Booking**: 4 charging machines with 4 ports each (16 total ports)
- **Real-Time Availability**: View port availability per machine
- **Easy Booking Flow**: Select date/time → Choose machine → Select specific port
- **Loyalty Program**: Transaction-based rewards (5th transaction: 30% discount, 10th: 45% discount)
- **Responsive Design**: Works on mobile, tablet, and desktop

### Admin Features
- **Dashboard**: Overview of bookings, charger status, and statistics
- **Port-Level Management**: Set individual port status (Available, Maintenance, Offline, etc.)
- **Booking Management**: Accept, cancel, or complete bookings
- **Customer Management**: View customer information
- **Schedule Management**: View and manage charging schedules

### Technical Features
- **Static HTML/CSS/JavaScript**: No backend required
- **localStorage Persistence**: Data persists in browser
- **GitHub Pages & Netlify Ready**: Easy deployment
- **Error Handling**: Robust fallback system for localStorage failures
- **Security Headers**: XSS protection and CSP

## Quick Start

### Local Development
1. Clone or download the repository
2. Open `index.html` in a web browser
3. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

### Deployment

#### Netlify Deployment (Recommended)
1. **Drag & Drop** (Easiest):
   - Go to [app.netlify.com](https://app.netlify.com)
   - Drag and drop the `ChargeWay-main` folder into the dashboard

2. **Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

3. **Git Integration**:
   - Push to GitHub/GitLab/Bitbucket
   - Import repository in Netlify dashboard
   - Deploy automatically on push

#### GitHub Pages Deployment
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main` or `master`)
4. Site will be live at `https://username.github.io/repository-name`

## Admin Access

- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Navigate to any admin page or click "Admin" in footer

## File Structure

```
ChargeWay-main/
├── index.html              # Homepage
├── about.html              # About page
├── booking.html            # Booking system
├── booking.js              # Booking logic
├── stations.html           # Charging stations display
├── contact.html            # Contact page
├── promotions.html         # Loyalty program info
├── faq.html                # FAQ page
├── services.html           # Services information
├── script.js               # Shared JavaScript functions
├── styles.css              # Main stylesheet
├── admin-login.html        # Admin login page
├── admin-login.js          # Admin login logic
├── admin-dashboard.html    # Admin dashboard
├── admin-dashboard.js      # Dashboard logic
├── admin-chargers.html     # Charger management
├── admin-chargers.js       # Charger management logic
├── admin-bookings.html     # Booking management
├── admin-bookings.js       # Booking management logic
├── admin-customers.html    # Customer management
├── admin-customers.js      # Customer management logic
├── admin-schedule.html     # Schedule management
├── admin-schedule.js       # Schedule management logic
├── admin-styles.css        # Admin-specific styles
├── netlify.toml            # Netlify configuration
├── package.json            # Node.js dependencies
└── .gitignore              # Git ignore rules
```

## Customization

### Updating Charger Data
Edit the `initializeSampleData()` function in `script.js` to modify:
- Machine names and types
- Port names and connector types
- Initial port statuses

### Styling
- Main styles: `styles.css`
- Admin styles: `admin-styles.css`
- CSS variables are defined at the top of each file for easy color customization

### Admin Credentials
Change the `DEMO_CREDENTIALS` object in `admin-login.js`:
```javascript
const DEMO_CREDENTIALS = {
    username: 'your-username',
    password: 'your-password'
};
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Limitations

- **No Backend**: Uses localStorage for data persistence (browser-specific)
- **Demo Data**: Each visitor gets independent data
- **No Real-Time Sync**: Changes don't sync across different browsers
- **Session-Based**: Admin session is stored in localStorage

## Deployment Notes

### localStorage Behavior
- **Local Development**: Data persists across page refreshes
- **Production**: Each visitor has independent localStorage
- **Cross-Device**: Data doesn't sync between devices
- **Privacy**: Data never leaves the user's browser

### Security Considerations
- Demo credentials are hardcoded (suitable for prototype only)
- No server-side validation
- Client-side authentication only
- For production, implement backend authentication

## Troubleshooting

### localStorage Issues
- Clear browser cache and localStorage
- Check browser console for errors
- Verify JavaScript is loading correctly

### Deployment Issues
- Ensure all files are in the root directory
- Check file paths in HTML are correct
- Verify build settings in deployment platform

### Admin Access
- Verify credentials are correct (admin/admin123)
- Check browser console for login errors
- Clear localStorage if session is corrupted

## License

MIT License - Free to use and modify

## Support

For deployment issues or questions, refer to:
- Netlify documentation: https://docs.netlify.com
- GitHub Pages documentation: https://docs.github.com/pages