import '../styles/globals.css';

export const metadata = {
  title: 'My Personal Website',
  description: 'A personal website with a blog',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-slate-100">{children}</body>
    </html>
  );
} 