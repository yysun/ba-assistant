# BA Assistant

BA Assistant is a tool that helps business analysts build requirement documents using AI Language Models (LLM).

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
- Create, edit, and delete prompts
- Default prompt templates for:
  - User Story Map
  - Customer Journey Map
  - Pages and Navigations
  - Pages and User Stories
  - Sprint Planning
- Custom prompt creation support
- Local storage integration

### 3. Document Generation
- AI LLM integration for content generation
- Multi-file content generation support
- Document-prompt matching
- Clipboard integration

### 4. User Interface
- Split-panel layout:
  - Left: Project ideas
  - Right: Document content
- Tab-based navigation
- Document selection system
- Copy-to-clipboard functionality
- Dark/Light theme toggle
- Collapsible sidebar

### 5. Settings
- Repository analysis capabilities:
  - Git repository statistics (commits, tags)
  - Feature extraction and analysis
  - Real-time updates via server-sent events
  - Repository summary generation
  - Commit history visualization
  - Copy features and summaries to clipboard
- Repository management:
  - Set and validate repository paths
  - Analyze repository structure
  - Track repository metrics

## Technical Implementation

### Prompt Management

- create a module for manage promts, it shoud be able to:

  - [X] create a new prompt
  - [X] edit a prompt
  - [X] load prompts from local storage
  - [X] save prompts documents to local storage
  - [X] delete a prompt
  - [X] each prompt should have a name, and the prompt text
  - [X] make default prompt list of 'User Story Map', 'Customer Journey Map', 'Pages and Navs', 'Page and Stories', 'Sprint Plan' if no prompts are loaded
  - [x] display the prompt cards in three columns on large screen; two columns on medium screen; one column on small screen

### Project Management

- create a module for manage project, it shoud be able to:
  - [x] do not manage projects, only handle one project
  - [x] create a new project, save to local storage by default
  - [x] load a project from local storage
  - [x] save a project to local storage
  - [x] open project from a folder
  - [x] save project to folder
  - [x] if a project is opened from a folder, always save to that folder
  - [x] a project should have `project.md` file that contains the project ideas, 
  - [x] each project contains markdown files that named as the following:
      - user-story-map.md
      - customer-journey-map.md
      - pages-and-navigations.md
      - pages-and-user-stories.md
      - sprint-planning.md
  - [x] each markdown file is generated using the prompts
  - [x] user can create new markdown files and create new prompt for it

### Home Page

- [x] load the project from local storage
- [x] create a new project if no project is loaded
- [x] display the project ideas in the left panel
- [x] display the document list in the page header as tabs, except the project ideas
- [x] beautigy the header tabs like 'User Story Map'
- [x] display the document content in the right panel when header tabs are clicked
- [x] auto save the document when user switch to another tab
- [x] match file with the prompts
- [x] generate the document content using the matching prompt
- [x] add a copy icon button to copy the text area content to the clipboard
- [x] create a select button to the left of the 'generate' button
  - [x] it should show the list of files to allow selecting multiple files 
  - [x] the selected file content will be used to generate prompt
- [x] add a 'Save' button to the page header in the same line of the tabs, aligned to the right
  - [x] the save button should open a dialog to select a folder
  - [x] once user selected a folder
  - [x] update the project's folder property 
  - [x] savs all files to the project's folder one by one
