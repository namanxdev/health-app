# 🏥 Health App - AI-Powered Lab Report Analysis

A modern, beautiful web application that transforms your lab reports into actionable health insights using OCR and AI technology.

## ✨ Features

- **🔍 Smart OCR Processing**: Upload PDF or image lab reports and extract text automatically
- **🤖 AI Health Analysis**: Intelligent parsing of health parameters with normal ranges
- **👤 User Authentication**: Secure sign-in with Clerk for personalized experience
- **📊 Report Management**: Save and organize your health reports (for signed-in users)
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **🌙 Dark Mode**: Elegant dark theme support
- **⚡ Fast Processing**: Optimized PDF-to-image conversion and OCR

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom gradients and animations
- **Authentication**: Clerk
- **OCR**: Tesseract.js for text extraction
- **PDF Processing**: PDF.js for PDF-to-image conversion
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd health-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Clerk URLs (optional, for custom domains)
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   
   # OpenAI API (if using AI features)
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Copy PDF.js Worker File** ⚠️ **IMPORTANT**
   
   To avoid CORS issues with PDF processing, you need to copy the PDF.js worker file:
   
   **Windows:**
   ```cmd
   copy node_modules\pdfjs-dist\build\pdf.worker.min.js public\pdf.worker.min.js
   ```
   
   **macOS/Linux:**
   ```bash
   cp node_modules/pdfjs-dist/build/pdf.worker.min.js public/pdf.worker.min.js
   ```
   
   **Manual Copy:**
   - Navigate to `node_modules/pdfjs-dist/build/`
   - Copy `pdf.worker.min.js`
   - Paste it into your `public/` folder

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Upload a Lab Report**
   - Drag and drop a PDF or image file (JPEG, PNG, WebP)
   - Or click to browse and select a file
   - Maximum file size: 10MB

2. **Processing**
   - PDFs are automatically converted to images
   - OCR extracts text from the image
   - AI analyzes and structures health parameters

3. **View Results**
   - Health parameters are displayed with values and normal ranges
   - Status indicators show if values are normal, high, or low
   - Signed-in users can save reports to their account

4. **Account Features** (Sign in required)
   - Save and organize lab reports
   - View historical health data
   - Secure cloud storage

## 🐛 Troubleshooting

### PDF Processing Issues

**Problem**: "PDF.js worker CORS error" or "Cannot load PDF worker"

**Solution**: Make sure you've copied the PDF.js worker file (step 4 above):
```cmd
copy node_modules\pdfjs-dist\build\pdf.worker.min.js public\pdf.worker.min.js
```

**Problem**: "PDF conversion failed" or "PDF.js not initialized"

**Solutions**:
1. Refresh the page and try again
2. Check browser console for specific error messages
3. Ensure the PDF file is not corrupted
4. Try a different PDF file

### OCR Issues

**Problem**: Poor text extraction quality

**Solutions**:
1. Ensure the image/PDF has clear, readable text
2. Try increasing image resolution before upload
3. Avoid heavily compressed or blurry images
4. Ensure text is in English (OCR is configured for English)

### Authentication Issues

**Problem**: Sign-in not working

**Solutions**:
1. Check your Clerk environment variables in `.env.local`
2. Verify Clerk dashboard configuration
3. Clear browser cookies and try again

## 🔧 Configuration

### Supported File Types
- PDF files (`.pdf`)
- JPEG images (`.jpg`, `.jpeg`)
- PNG images (`.png`)
- WebP images (`.webp`)

### File Size Limits
- Maximum file size: 10MB
- Recommended: Under 5MB for faster processing

### OCR Configuration
The app uses Tesseract.js configured for English text recognition. You can modify the language in `FileInput.tsx` if needed:

```typescript
const worker = await Tesseract.createWorker('eng', 1, {
  // Change 'eng' to other language codes as needed
  // Example: 'spa' for Spanish, 'fra' for French
});
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Build command**: `npm run build`
4. **Deploy**

⚠️ **Important**: After deployment, you may need to copy the PDF.js worker file to your build. Consider adding a post-build script:

```json
{
  "scripts": {
    "postbuild": "cp node_modules/pdfjs-dist/build/pdf.worker.min.js public/pdf.worker.min.js"
  }
}
```

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Heroku
- AWS
- Digital Ocean

## 🏗️ Project Structure

```
health-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── FileInput.tsx          # Main file upload component
│   │   ├── api/
│   │   │   ├── process-report/        # AI health analysis endpoint
│   │   │   └── save-report/           # Report saving endpoint
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Main page with beautiful UI
├── public/
│   ├── pdf.worker.min.js             # PDF.js worker (copy manually)
│   └── ...                           # Other static assets
├── package.json
└── README.md
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).



**Built by naman using Next.js, TypeScript, and modern web technologies.**
