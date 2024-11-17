# Style Guide

Standardized Tailwind CSS classes for visual consistency.

## Fonts

### Font Family

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
```

## Form Controls

### Basic Input Fields

```css
block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs font-medium
```

### Search Input with Icon

Container:

```css
relative
```

Icon Container:

```css
absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none
```

Input Field:

```css
block w-full pl-11 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs font-medium
```

## Tables

### Table Container

```css
w-full bg-white rounded-lg border border-gray-200 overflow-hidden
```

### Table Element

```css
w-full divide-y divide-gray-200
```

### Table Header

Header Row:
```css
bg-gray-50
```

Header Cell:
```css
px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
```

### Table Body

Body Container:
```css
divide-y divide-gray-200
```

Row:
```css
hover:bg-gray-50 cursor-pointer
```

Cell:
```css
px-6 py-2.5 whitespace-nowrap
```

### Cell Content

Text:
```css
text-sm text-gray-600
```

Link:
```css
text-sm text-blue-600 hover:text-blue-800
```

Status with Icon:
```css
flex items-center gap-1.5
```

### Responsive Behavior

Company Column:
```css
hidden xl:table-cell
```

Email Column:
```css
hidden md:table-cell
```

### Loading State

```css
bg-white px-6 py-4 border-t border-gray-200
```

### Example Usage

```jsx
<div class="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
  <div class="w-full">
    <table class="w-full divide-y divide-gray-200">
      <thead>
        <tr class="bg-gray-50">
          <th class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Column Header
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr class="hover:bg-gray-50 cursor-pointer">
          <td class="px-6 py-2.5 whitespace-nowrap">
            <span class="text-sm text-gray-600">Cell Content</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

## Buttons

### Primary Button

```css
inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700
```

### Secondary Button

```css
inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600
```

## Typography

### Labels

```css
block text-xs font-medium text-gray-700 dark:text-gray-200 mb-2
```

### Content Text

```css
text-gray-600 dark:text-gray-300 text-xs
```

### Headings

```css
text-xs font-medium text-gray-900 dark:text-white
```

## Tags

### Tag Container

```css
flex flex-wrap gap-2
```

### Individual Tag

```css
px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs
```

## Cards and Containers

### Basic Card

```css
bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700
```

### List Container with Dividers

```css
divide-y divide-gray-200 dark:divide-gray-700
```

## Best Practices

1. **Text Size**: Use `text-xs` consistently.
2. **Dark Mode**: Include `dark:` variants.
3. **Interactive States**: Add hover and focus effects.
4. **Spacing**: Use consistent padding, margins, and gaps.
5. **Color Usage**: `bg-blue-600` for primary actions; gray scale for secondary elements.
6. **Responsive Design**: Use appropriate breakpoints (md, lg, xl) for responsive visibility.
7. **Table Structure**: Maintain consistent cell padding and text alignment.

## Example Usage

### Form Field

```jsx
<label class="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">
  Field Label
</label>
<input
  type="text"
  class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs font-medium"
  placeholder="Enter value"
/>
```

### Button Group

```jsx
<button class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700">
  Save Changes
</button>
<button class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
  Cancel
</button>
```

### Tag List

```jsx
<div class="flex flex-wrap gap-2">
  <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
    Tag 1
  </span>
  <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
    Tag 2
  </span>
</div>
