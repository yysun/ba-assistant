/**
 * Card Component
 * 
 * A reusable card component for displaying content with a header and copy functionality.
 * Used in the settings page for showing repository features and summaries.
 * 
 * Props:
 * - title: Header text displayed in the card
 * - content: Content to display in the textarea
 * - copyTitle: Tooltip text for copy button
 */

import { app } from 'apprun';

interface CardProps {
  title: string;
  content: string;
  copyTitle: string;
}

export default function Card({ title, content, copyTitle }: CardProps) {
  const handleCopy = async (e: MouseEvent) => {
    try {
      await navigator.clipboard.writeText(content);

      const tooltip = document.createElement('div');
      tooltip.textContent = 'Copied!';
      tooltip.className = 'absolute top-8 -left-6 px-2 py-1 text-xs bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded shadow pointer-events-none z-50 whitespace-nowrap';

      const buttonContainer = (e.target as HTMLElement).closest('.relative');
      if (buttonContainer) {
        buttonContainer.appendChild(tooltip);
        setTimeout(() => tooltip.remove(), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div class="bg-white dark:bg-gray-800 rounded-md shadow-sm flex flex-col h-full">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h4 class="text-xs font-bold text-gray-700 dark:text-gray-300">{title}</h4>
          <div class="relative">
            <button
              onclick={handleCopy}
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title={copyTitle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="flex-1 text-xs">
        <textarea
          readonly
          class="w-full h-[calc(100vh-20rem)] resize-none p-2 bg-gray-100 dark:bg-gray-800 outline-none dark:text-gray-100 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg"
          value={content}
        />
      </div>
    </div>
  );
}
