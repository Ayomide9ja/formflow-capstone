FormFlow Capstone Project


Project Overview


FormFlow is a 3-tier web application I built for the Kura Capstone assignment. It uses a React frontend, a Node.js/Express backend, and a PostgreSQL database. Everything is packaged in Docker containers and automatically deployed to an Azure Virtual Machine using GitHub Actions.

Phase 0 Design Worksheet
Tier Boundaries
We broke this app down into three main parts to keep things secure and organized:

The Frontend (Tier 1): Built with React and served by Nginx on port 80. This is the only part of the app exposed to the public internet.

The Backend (Tier 2): A Node.js API that runs on port 5000 internally. It handles all the business logic and talks to the database.

The Database (Tier 3): A PostgreSQL database running on a private Docker network. Nobody from the outside can access it directly, which keeps our data safe.

Versioning Strategy
For versioning, I used Git Commit SHAs instead of just tagging everything as "latest". During deployment, GitHub Actions tags the Docker images with the specific commit hash and saves that hash in a .env file on the Azure server. This setup is a lifesaver because if a bad update goes live, I can just change the hash in the .env file back to a previous working version and restart the app.

Secrets Management
No passwords or sensitive keys are hardcoded in the codebase. Things like the database password, Docker Hub token, and SSH keys are stored safely in GitHub Secrets. During the deployment process, GitHub Actions injects these secrets into the server's .env file so the application can use them without exposing them to the public.

CI/CD Deployment Screenshots
<img width="1906" height="930" alt="CI-CD Success " src="https://github.com/user-attachments/assets/c9426dba-9f00-4c23-8053-8c045fe5f030" />


<img width="967" height="562" alt="Formflow productions" src="https://github.com/user-attachments/assets/bb766a1c-0f09-441c-9f56-cedb2b070da2" />

<img width="967" height="562" alt="formflow-error" src="https://github.com/user-attachments/assets/d1114103-4407-4945-a77b-0f09f9baa695" />


<img width="967" height="562" alt="Formflow productions" src="https://github.com/user-attachments/assets/32b45a35-317c-4254-a1f5-87481b42c366" />


Incident Report: Post-Deployment Rollback Test
Symptom
Right after a new deployment went out, the application broke. The frontend either threw a 502 Bad Gateway error or showed a message saying it couldn't load the backend data.

Investigation Trail
I SSH'd into the Azure virtual machine to see what was going on. I ran a quick "docker compose ps" to check the status of the containers. The database and frontend were running fine, but the backend container had crashed and was showing an "Exited (1)" status.

Root Cause
This was an intentional failure for the rollback test. I added a code injection to the server.js file that forced the backend server to crash on startup.

Fix
Instead of pushing a new code fix through the entire CI/CD pipeline (which takes time), I did a manual rollback right on the server to get the site back online instantly. I found the 7-character Git commit hash of the last working version, opened the .env file on the Azure VM, and updated the APP_VERSION to match that working hash. After running "docker compose pull" and "docker compose up -d", the site was fully restored.

Design Reflection
This test proved why tagging images with Git Commit SHAs is so much better than using the "latest" tag. Because the older, working images were still saved on Docker Hub with their unique hashes, rolling back just meant pointing the server back to the old hash. If everything was tagged as "latest", the broken code would have overwritten the working code, and the fast rollback would have been impossible.

Teardown Instructions
To avoid getting charged for cloud resources after grading is done, you can delete the entire environment. Run this command in the Azure Cloud Shell or your local terminal to delete the resource group:

az group delete --name FormFlow-RG --yes --no-wait
