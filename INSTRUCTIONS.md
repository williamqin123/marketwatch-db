Steps to Set Up Project

1. Accept invite
2. Generate local SSH key then paste in github SSH keys
3. Navagate to the projects folder on your device then clone the repo "git clone git@github.com:Daniel6278/marketwatch-db.git"
4. Set up python virtual environment, "python3 -m venv venv" then activate the environment "source venv/bin/activate" now your terminal should show (venv)
5. Install dependencies "pip install -r requirements.txt"
6. Set up database connection: Copy ".env.example" to ".env" and add your database password
7. Create database tables: Run "python create_tables.py" to create all tables (does not load data)
8. There are two branches currently we can add more if needed, but do most testing on develop branch then once it works push to the main branch, make sure each branch is up to date before starting work and make sure to resolve all chnages before leaving.
9. LMK if you have any questions.


To connect to the database in MySQL WorkBench
1. Create a new Server Connection
2. Hotname = AWS-ENDPOINT
3. Username = admin
4. Leave Default Schema Blank
5. Test Connection to confirm 


