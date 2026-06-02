import './globals.css';

export const metadata = {
  title: "AllInOnePlace - Premium Event & Wedding Directory Sri Lanka",
  description: "Discover verified premium wedding photographers, luxury bridal salons, elegant vehicle rentals, and corporate conference managers across Colombo, Kandy, Galle, and all of Sri Lanka.",
  keywords: [
    "Sri Lanka Wedding",
    "Colombo Photographers",
    "Kandy Bridal Salon",
    "Event Planner Sri Lanka",
    "Wedding Directory Colombo",
    "Wedding Cars Colombo",
    "Sri Lanka Event Managers"
  ],
  robots: "index, follow"
};

export const viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
