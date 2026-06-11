import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "NeuroScan AI — Brain Tumor Detection Platform",
  description:
    "AI-powered brain tumor detection platform. Upload an MRI scan for instant clinical-grade tumor classification, Grad-CAM explainability, tumor segmentation, and severity scoring.",
  keywords:
    "brain tumor detection, MRI analysis, AI radiology, Grad-CAM, deep learning, neural network, medical imaging",
  openGraph: {
    title: "NeuroScan AI — Brain Tumor Detection Platform",
    description:
      "Upload an MRI scan for instant AI-powered brain tumor classification and clinical insights.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(10,10,28,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#eeeeff",
              backdropFilter: "blur(20px)",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
