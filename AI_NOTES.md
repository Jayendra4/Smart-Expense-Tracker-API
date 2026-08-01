# AI Notes

## 1. Which parts were AI-assisted?
I treated AI as a development assistant rather than a code generator. I used it to speed up repetitive tasks, brainstorm approaches, and review implementation ideas, while making the final implementation decisions and verification myself and had it write some basic Express boilerplate code so I could jump straight into the logic. 

I also used AI to help with the initial Swagger documentation. Writing OpenAPI syntax by hand can be tricky and time-consuming, so having the AI draft the basic JSDoc blocks for my routes was a huge help. Aside from that, I asked the AI for validation suggestions when setting up my `express-validator` rules, and I used it to generate a few ideas for test cases that I could build my Jest integration tests around. I also asked it a few debugging questions when I got stuck on error handling concepts.

## 2. What did I validate, test or change?
I made sure to review all the code and suggestions the AI provided before actually using them in my project. The generated boilerplate was helpful, but I had to modify the route handlers and services quite a bit to match the specific logic required for this assignment.In several places I rewrote or refactored the generated code to make it simpler, improve readability, and keep the implementation consistent with the rest of the project. I also renamed variables and reorganized some functions so the code matched my own coding style and the layered architecture used in the application.

I spent time fixing bugs and standardizing the API responses. I reviewed the JSON output of every endpoint to ensure success and error cases were formatted consistently across the application. I also realized the AI missed some important edge cases for input validation, so I manually updated the rules to check for positive numbers and strict date formats.

For the documentation, I had to fix several broken schema references in the Swagger configuration and delete a few endpoints the AI incorrectly assumed I had built. Finally, I tested all of my endpoints using the Swagger UI interface and ran my full Jest test suite to verify that everything works correctly, including how the app handles missing or corrupted JSON storage files.

## 3. Which AI suggestions did I not use, and why?
Throughout the development process, the AI frequently suggested adding extra features that were outside the scope of the assignment. For instance, it strongly recommended adding user authentication using JWT and creating login and register routes. It also tried to push me toward using MongoDB for database storage instead of a simple local file. 

Later on, it suggested wrapping the application in Docker containers and adding pagination to the endpoint that fetches all expenses. I intentionally rejected all of these suggestions. My main goal was to keep the project strictly aligned with the assignment requirements. Adding a database or authentication would have made the project much more complicated than requested. I decided to stick with simple local JSON file storage and a public API to ensure I met the exact requirements without over-engineering the solution.
