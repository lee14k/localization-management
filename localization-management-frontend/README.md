## Getting Started

After the repo has been pulled down, run npm i in the front-end directory to install dependencies.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the demo. For running the backend, follow the instructions in the README inside of the localization-management-api directory. Create an .env file with SUPABASE_URL and SUPABASE_KEY variables specific to your Supabase database. Test scripts can be run with source .venv/bin/activate && python3 test_performance.py Front-end tests can be run with npm test.

##Approach
I tackled this by approaching the state management via Zustand, and then applying TanStack (React Query) Query for searching and filtering results. I used Zod for schema creation and validation. I used lucide-react for icons, and built the components using Tailwind and the styles that were inside of the repository. 

This is deployed on Next.js via the front-end directory. 

I chose the bulk update endpoint for multiple translations as an expansion of the back-end. I used Pydantic (validation and type enforcement), and statistics (generation of basic common output values like median request time.)

##Testing Considerations
I mocked React Query, Zustand, and routing dependencies to ensure I had predictable outcomes and so I could focus on testing component behavior vs. state logic. I approached testing the Zod validations in the same way. If I put in more time, I would have written tests specific to state logic, query logic, and Zod validations. My testing suite focuses on component states and how they are handled in the context of the user, and isolation first to achieve true unit testing that mimics user behavior for each component. I considered edge cases throughout my components as well, including filters being toggled on and off, searches being entered vs. not being entered, and the appearance of error messages and alerts to the user (i.e. translations not being available for a given key). With the deadline given, I wanted to demonstrate competence with testing, while at the same time not spending too much time on testing things too deeply. I took an approach that is focused on testing the user's experience and functionality, with the (perhaps very optimistic) assumption that everything around it would either work, or if it didn't work, could be debugged and solved from a developer's vantage point (i.e., me!).

My back-end approach was simple and performance focused, and ensured that the endpoints could be hit successfully. The output gives a neatly formatted summary printout of the results. The performance descriptions are arbitrary and just provide a way for developers to determine if certain benchmark values have been hit (easily customizable for whatever timeframes a team might deem excellent, good, etc;).

##Trade-offs
Potential trade-offs of the codebase and technologies used include:
-I initially tried to deploy this to Vercel as a monorepo, but ended up just deploying the front-end repository and refactored the API as a separate folder within the front-end repository. While keeping everything together is convenient, there were challenges with deployment that forced me reevaluate for the sake of time. I did modify several files at the root directory to get a deployment to Vercel working (some changes ultimately may not have been necessary, like changing the next.config.ts to next.config.js) but for the purposes of this take-home assessment, I wanted to show my skills in troubleshooting and navigating what is effectively a 'dev' environment getting up and running.
-Next.js and FastAPI - the two technologies work together, but for the sake of argument, using the build in support for native API routes with Node.js is always a worthwhile consideration. I find the set-up and configuration of FastAPI to be more efficient and lightweight, but it depends on the individual application's needs. 
-Zustand vs. Redux - I generally prefer Redux, as it has more robust DevTools. However, Zustand is more simple and lightweight, making development far easier.
-Use of MapSet - while it would reduce the overhead of installing another bundle, pure Zustand implementation can be challenging to read and understand and I find MapSet reduces the complexity of a codebase just by being more legible. I could have used Array instead of MapSet, but there are performance drawbacks (O(n) vs. O(1)) to using Array. Overall, in the interest of both clarity and performance, I believe using MapSet is sustainable as long as bundle size is not a severely limiting factor (in many cases, it is not, but there are many cases where it could be an important consideration, such as evaluating costs and the time it takes for deployment)
-I chose to filter data on the client side - this may result in performance drawbacks with larger datasets, but for demonstration purposes, I wanted to consider time and UI responsiveness over performance. 
-Comprehensiveness of testing - for the sake of time, I implemented a simple testing suite that 
-Supabase has limitations - for the purpose of a take-home assessment and demonstration of basic back-end competencies, it is an excellent tool. In my experience, Supabase can be a limitiation in cost and as an application is scaled, is not the best choice. 

##Future Considerations
-Actual API integration vs. mocking the set-up with sample data.
-More robust integration testing to simulate actual state and query logic.
-Pagination and further edge case consideration on the front-end (what if there is a lot of data?).

