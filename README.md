# JurisAI - Your AI-Powered Legal Assistant

JurisAI is a web application designed to be an intelligent legal assistant, specifically tailored for Indian law. It leverages cutting-edge generative AI to provide users with a suite of tools to simplify legal research, document analysis, and understanding of complex legal texts.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Key Features & Workflow](#key-features--workflow)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
- [Deployment](#deployment)

## Tech Stack

JurisAI is built with a modern, robust, and scalable technology stack:

- **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models.
- **Form Handling**: React Server Actions

## Key Features & Workflow

JurisAI offers several powerful tools to assist users with their legal queries:

### 1. AI Chat Assistant
The core feature of the application. Users can:
- **Ask Legal Questions**: Describe a situation in plain English to receive suggestions for relevant Indian laws.
- **Document Analysis**: Upload documents (PDF, TXT, DOCX, and images) to get an instant summary or ask specific questions about the content of the file.

### 2. Law Explorer
This tool simplifies complex legal jargon. Users can paste a section of a law or a legal text, and the AI will provide a simplified summary, breaking it down into easy-to-understand points.

### 3. Case Finder
Users can search for relevant past Indian court judgments by simply entering keywords or case topics. The AI will return a formatted summary of relevant cases, including key rulings and principles.

## Getting Started

Follow these instructions to set up the project for local development.

### Prerequisites

- [Node.js](https://nodejs.org/en) (version 18 or later recommended)
- `npm` or `yarn`

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project and add your Google AI API key:
    ```
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
    You can obtain a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

5.  **Run the Genkit developer UI (optional):**
    In a separate terminal, run the following command to inspect and test your AI flows:
    ```bash
    npm run genkit:dev
    ```
    The Genkit developer UI will be available at `http://localhost:4000`.

## Deployment

This application is configured for easy deployment with [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

1.  **Initialize Firebase:**
    If you haven't already, initialize Firebase in your project directory:
    ```bash
    firebase init hosting
    ```
    - Select **App Hosting (preview)**.
    - Follow the prompts to select your Firebase project.

2.  **Deploy:**
    Run the following command to build and deploy your application:
    ```bash
    firebase deploy --only hosting
    ```
    Firebase will provide you with the URL of your deployed application. The `apphosting.yaml` file in the root of the project contains the basic configuration for the deployment.
