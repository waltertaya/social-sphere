"""Basic connection example.
"""

import redis

import os
from dotenv import load_dotenv

load_dotenv()

r = redis.Redis(
    host=os.getenv('CACHE_HOST'),
    port=os.getenv('CACHE_PORT'),
    decode_responses=os.getenv('CACHE_DECODE_RESPONSES'),
    username=os.getenv('CACHE_USERNAME'),
    password=os.getenv('CACHE_PASSWORD'),
)
