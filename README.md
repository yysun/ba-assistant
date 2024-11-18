## BA Assistant

BA Assistant is a tool helps business analysts building requirement documents using AI LLM.

**Feature Summary:**

- **Project Management**
  - Create and manage multiple projects.

  - A project is a folder that contains documents that are generated using AI language models based on project ideas, including:
    - Project Ideas
    - User Story Map
    - Customer Journey Map
    - Pages and Navigations
    - Pages and User Stories
    - Sprint Planning

- **Promot Mangement**

  - Create and manage prompts for generating project documents.


- **Document Editing and Storage**
  - Edit generated documents within the app.
  - Save documents to the local file system for offline access.

- **Prompt Management**
  - Create and manage custom prompts for generating project documents.

- **Configuration**
  - Select and configure different AI language models to use for document generation.




## Prompt Management

- create a module for manage promts, it shoud be able to:

  - [X] create a new prompt
  - [X] edit a prompt
  - [X] load prompts from local storage
  - [X] save prompts documents to local storage
  - [X] delete a prompt
  - [X] each prompt should have a name, and the prompt text
  - [X] make default prompt list of 'User Story Map', 'Customer Journey Map', 'Pages and Navs', 'Page and Stories', 'Sprint Plan' if no prompts are loaded


## Project Management

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

## Home Page

- [x] load the project from local storage
- [x] create a new project if no project is loaded
- [x] display the project ideas in the left panel
- [x] display the document list in the page header as tabs, except the project ideas
- [x] beautigy the header tabs like 'User Story Map'
- [x] display the document content in the right panel when header tabs are clicked
- [x] auto save the document when user switch to another tab
- [x] add a 'Generate' button to combine the ideas with the match prompt
- [X] add a copy icon button to copy the text area content to the clipboard
- [ ] 