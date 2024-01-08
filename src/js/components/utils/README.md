# Input Validation and Sanitization Library

This library provides simple utility functions for input validation and sanitization, particularly useful in web applications to enhance security and data integrity.

## Features

- **Escape Input**: Sanitizes input strings by escaping special HTML characters.
- **Validate Input**: Checks if input strings meet specified validation criteria, such as length.

## Installation

Include this library in your project by importing the functions:

```javascript
import { escapeInput, isValidInput } from './path_to_library'
```

## Usage
## Escaping Input

To prevent Cross-Site Scripting (XSS) attacks, use the `escapeInput` function. This function converts special characters (&, <, >, ", ') in the string to their corresponding HTML entities.

```javascript
const safeString = escapeInput(userInput)
```

## Validating Input

To validate the input string, such as checking its length, use the `isValidInput` function. You can modify the function to include additional validation checks as needed.

```javascript
const isValid = isValidInput(userInput);
if (isValid) {
  // process input
} else {
  // handle invalid input
}
```

## Customization

- Modify the `isValidInput` function to include more comprehensive validation rules.
- Update the `escapeInput` function if there are more characters you wish to escape based on your application's context.
