🎬 CineVerse - Movie Discovery App
CineVerse is a sleek and dynamic web application for discovering movies. Search for any film, browse real-time trending lists from Trakt.tv, and see what's popular among the app's users. Built with React, it features a modern interface and an efficient search experience.


![alt text](<Screenshot 2025-07-24 191708.png>) 

![alt text](<Screenshot 2025-07-24 191336-1.png>) 

![alt text](<Screenshot 2025-07-24 191357.png>) 

![alt text](<Screenshot 2025-07-24 191457.png>)



✨ Features
Dynamic Header: An engaging typing animation in the hero section.

Real-time Movie Search: Instantly search for any movie using the Trakt.tv API.

Optimized API Requests: Search functionality is debounced to prevent excessive API calls and improve performance.

Trending from Trakt.tv: The main movie list displays the current trending movies from Trakt.tv by default.

Community-Driven Trends: Utilizes an Appwrite backend to track user search queries, creating a "Trending Searches" section based on what's most popular among users.

Clean UI: A modern, intuitive, and easy-to-navigate user interface.

Detailed Views: Click on any movie to navigate to its dedicated details page (functionality enabled by react-router).

🛠️ Tech Stack
Frontend:

React - A JavaScript library for building user interfaces.

React Router - For declarative routing in the application.

Axios - For making API requests to the Trakt.tv API.

react-use - For the useDebounce hook to optimize search.

Vite - A modern, fast frontend build tool.

Backend & Database:

Appwrite - Used as a backend server to store and manage user search counts for the community trending feature.

APIs:

Trakt.tv API - Provides primary movie data, images, and trending information.

OMDb API - Used for supplementary movie data.

Styling:

CSS with utility classes (e.g., text-red-500 suggests a framework like Tailwind CSS or custom utility styles).

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Make sure you have the following installed on your machine:

Node.js (v16 or higher)

npm or yarn

Installation
Clone the repository:

Bash

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
Install dependencies:

Bash

npm install
Set up Environment Variables:
Create a file named .env in the root of your project and add the following variables. You will need to get your own API keys.

Code snippet

# Your Trakt.tv API Key (https://trakt.tv/oauth/applications)
VITE_TRAKT_API_KEY=your_trakt_api_key

# Your OMDb API Key (http://www.omdbapi.com/apikey.aspx)
VITE_OMDB_API_KEY=your_omdb_api_key

# Your Appwrite project details (https://cloud.appwrite.io)
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
VITE_APPWRITE_COLLECTION_ID_SEARCHES=your_appwrite_collection_id
Note: In your Appwrite database, you need to create a collection with attributes to store the query (string) and search_count (integer).

Run the development server:

Bash

npm run dev
Open http://localhost:5173 (or the port shown in your terminal) to view it in the browser.

📜 Available Scripts
In the project directory, you can run:

npm run dev - Runs the app in development mode.

npm run build - Builds the app for production to the dist folder.

npm run preview - Serves the production build locally to preview it.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

🙏 Acknowledgements
A big thank you to Trakt.tv for providing the free and comprehensive movie data API.

Thanks to the OMDb API for additional movie details.

Shoutout to the developers of Appwrite for their easy-to-use open-source backend server.