/**
 * Prompt Management Service
 * ------------------------
 * Manages AI prompt templates for BA document generation.
 * 
 * Data Model:
 * - Prompt: { id: UUID, name: string, text: string }
 * - Built-in templates: Story Map, Journey Map, Navigation, etc.
 * 
 * Storage:
 * - localStorage with fallback to DEFAULT_PROMPTS
 * 
 * Service Pattern:
 * - Singleton promptService instance
 * - CRUD operations with async interface
 * - Default prompts as fallback templates
 */

export type Prompt = {
  id: string;
  name: string;
  text: string;
}

export class PromptService {
  private STORAGE_KEY = 'ba-assistant-prompts';

  private DEFAULT_PROMPTS: Prompt[] = [
    {
      id: crypto.randomUUID(),
      name: 'User Story Map',
      text: 'Help me create a user story map with the following structure:\n\nUser Activities (Top Level):\n[Activities]\n\nUser Tasks (Second Level):\n[Tasks]\n\nUser Stories (Details):\n[Stories]\n\nContext:\n[Project/Feature Context]'
    },
    {
      id: crypto.randomUUID(),
      name: 'Customer Journey Map',
      text: 'Help me create a customer journey map with these components:\n\nPersona:\n[Customer Type]\n\nStages:\n[Journey Stages]\n\nActions:\n[Customer Actions]\n\nThoughts & Feelings:\n[Customer Experience]\n\nPain Points:\n[Issues & Challenges]\n\nOpportunities:\n[Potential Improvements]'
    },
    {
      id: crypto.randomUUID(),
      name: 'Page Navigations',
      text: 'Help me design the page structure and navigation:\n\nSite Map:\n[Page Hierarchy]\n\nNavigation Flow:\n[User Navigation Paths]\n\nPage Components:\n[Key UI Elements]\n\nInteraction Points:\n[User Interactions]'
    },
    {
      id: crypto.randomUUID(),
      name: 'Page User Stories',
      text: 'Help me define the page requirements and user stories:\n\nPage Purpose:\n[Main Objectives]\n\nUser Stories:\n[As a... I want... So that...]\n\nAcceptance Criteria:\n[Criteria List]\n\nTechnical Notes:\n[Implementation Details]'
    },
    {
      id: crypto.randomUUID(),
      name: 'Sprint Plan',
      text: 'Help me create a sprint plan:\n\nSprint Goal:\n[Objective]\n\nDeliverables:\n[User Stories/Tasks]\n\nEstimates:\n[Story Points/Time]\n\nDependencies:\n[Blockers/Prerequisites]\n\nRisks:\n[Potential Issues]'
    }
  ];

  async loadPrompts(): Promise<Prompt[]> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    try {
      const storedPrompts = stored ? JSON.parse(stored) : '';
      return Array.isArray(storedPrompts) ? storedPrompts : this.DEFAULT_PROMPTS;
    } catch (error) {
      return this.DEFAULT_PROMPTS;
    }
  }

  async savePrompts(prompts: Prompt[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prompts));
  }

  async createPrompt(name: string, text: string): Promise<Prompt> {
    const prompts = await this.loadPrompts();
    const newPrompt = { id: crypto.randomUUID(), name, text };
    prompts.push(newPrompt);
    await this.savePrompts(prompts);
    return newPrompt;
  }

  async updatePrompt(prompt: Prompt): Promise<void> {
    const prompts = await this.loadPrompts();
    const index = prompts.findIndex(p => p.id === prompt.id);
    if (index >= 0) {
      prompts[index] = prompt;
      await this.savePrompts(prompts);
    }
  }

  async deletePrompt(id: string): Promise<void> {
    const prompts = await this.loadPrompts();
    const filtered = prompts.filter(p => p.id !== id);
    await this.savePrompts(filtered);
  }
}

export const promptService = new PromptService();
