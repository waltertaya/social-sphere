import os
from dotenv import load_dotenv

class Config:
    load_dotenv()
    JWT_SECRET_KEY=os.getenv('JWT_SECRET_KEY')