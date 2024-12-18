# BA Assistant

BA Assistant is a tool that helps business analysts build requirement documents using AI Language Models (LLM).

## Installation

1. Prerequisites:
   - Node.js (v16 or higher)
   - npm (comes with Node.js)
   - [Ollama](https://ollama.ai/) - Required for AI/LLM functionality

2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ba-assistant.git
   cd ba-assistant
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:8080`

### Production Mode
1. Build the application:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open your browser and navigate to `http://localhost:3000`

### Using Docker
1. Prerequisites:
   - Docker and Docker Compose installed
   - NVIDIA GPU and drivers (optional, for GPU acceleration)

2. Run the application:
   ```bash
   docker compose up
   ```
   This will:
   - Start the BA Assistant application on port 8080
   - Start Ollama service with GPU support (if available)
   - Configure all necessary environment variables
   - Mount Ollama data volume for model persistence

3. Access the application:
   - Open your browser and navigate to `http://localhost:8080`

4. Environment Configuration:
   The Docker setup includes the following default configurations:
   - Ollama endpoint: http://ollama:11434/
   - Model: llama3.2:3b
   - Temperature: 0.3
   - Max tokens: 4096
   - Language: English
   - Streaming: enabled
   - Retry attempts: 3
   - Retry delay: 1000ms

## Core Features

### 1. Project Management
- Single project workspace with local storage support
- Project folder structure:
  - project.md (Project Ideas)
  - user-story-map.md
  - customer-journey-map.md
  - pages-and-navigations.md
  - pages-and-user-stories.md
  - sprint-planning.md
- Project Operations:
  - Create/Open projects
  - Auto-save functionality
  - Export to folder
  - Local storage integration

### 2. Prompt Management
- Responsive grid-based prompt listing (3 columns on large screens, 2 on medium, 1 on small)
- Inline modal editor for prompt creation and editing
- Each prompt contains:
  - Name field for identification
  - Text area for prompt content
- Default prompt templates for:
  - User Story Map
  - Customer Journey Map
  - Sprint Planning
- Custom prompt creation support
- Local storage persistence
- Dark mode compatible UI

### 3. Document Generation
- AI LLM integration for content generation
- Multi-file content generation support
- Document-prompt matching
- Clipboard integration
- Server-Sent Events (SSE) for streaming responses
- Integration with Ollama chat service

### 4. User Interface
- Split-panel layout:
  - Left: Project ideas
  - Right: Document content
- Tab-based navigation
- Document selection system
- Copy-to-clipboard functionality
- Dark/Light theme toggle
- Collapsible sidebar
- Responsive design with Tailwind CSS

### 5. Project Settings
- Repository analysis capabilities:
  - Git repository statistics (commits, tags)
  - Feature extraction and analysis
  - Real-time updates via server-sent events (SSE)
  - Repository summary generation
  - Commit history visualization
  - Copy features and summaries to clipboard
- Repository management:
  - Set and validate repository paths
  - Repository path persistence
  - Live feature extraction with loading states
  - Error handling and validation
  - Dual-panel display for features and summary

## Technical Implementation

### Frontend Architecture
- Built with AppRun for state management and component architecture
- TypeScript for type safety and better developer experience
- Tailwind CSS for responsive styling
- Component-based structure in `/pages` directory:
  - Home (`/pages/home`): Main workspace
  - Settings (`/pages/settings`): Repository analysis
  - Prompts (`/pages/prompts`): Prompt management

### Backend Services
- Server-Sent Events (SSE) endpoints for real-time updates
- Chat API integration with Ollama
- Git repository analysis services:
  - Statistics collection
  - Feature extraction
  - Repository structure analysis
