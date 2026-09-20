import './globals.css';

export const metadata = {
  title: 'AI Harness',
  description: 'One place to call different LLM providers via API',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
