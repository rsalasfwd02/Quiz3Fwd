const fs = require('fs');
const files = [
    { old: 'src/App.jsx', new: 'src/App.tsx' },
    { old: 'src/main.jsx', new: 'src/main.tsx' },
    { old: 'src/services/api.js', new: 'src/services/api.ts' },
    { old: 'src/components/navbar.jsx', new: 'src/components/Navbar.tsx' },
    { old: 'src/pages/Home.jsx', new: 'src/pages/Home.tsx' },
    { old: 'src/pages/home.jsx', new: 'src/pages/Home.tsx' },
    { old: 'src/pages/Login.jsx', new: 'src/pages/Login.tsx' },
    { old: 'src/pages/login.jsx', new: 'src/pages/Login.tsx' },
    { old: 'src/pages/UserProfile.jsx', new: 'src/pages/UserProfile.tsx' },
    { old: 'src/pages/AdminDashboard.jsx', new: 'src/pages/AdminDashboard.tsx' },
];

for (const { old: o, new: n } of files) {
    try {
        if (fs.existsSync(o)) {
            fs.renameSync(o, n);
            console.log(`Renamed ${o} to ${n}`);
        } else {
            console.log(`File ${o} not found`);
        }
    } catch (e) {
        console.error(`Failed to rename ${o}:`, e);
    }
}
