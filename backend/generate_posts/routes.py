from flask import Blueprint, jsonify, request
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_cors import CORS
from openai import OpenAI
import os

from utils import parse_json

generate_posts_routes = Blueprint("generate_posts_routes", __name__)

load_dotenv()

client = OpenAI(
	api_key=os.getenv('LLMAPI'),
	base_url=os.getenv('BASE_URL')
)

@generate_posts_routes.route("/", methods=['POST'])
def deepseek_posts_creation():

	data = request.json.get('post', None)

	if data == None:
		return jsonify(
				{
					"msg": "error generating posts"
				}
			), 400

	
	chat_completion = client.chat.completions.create(
    messages=[
	        {
	            "role": "system",
	            "content": '''
	                "You are an AI assistant that generates engaging and platform-specific social media content. "
	                "Given a user's input post idea or context, respond with a JSON object containing suggested "
	                "titles, descriptions, hashtags, and optional call-to-actions tailored for each platform: "
	                "TikTok, YouTube, Instagram, and X (formerly Twitter). "
	                "Ensure the content is concise, creative, and appropriate for each platform.\n\n"
	                "Respond in the following JSON format:\n"
	                "{\n"
	                "  \"tiktok\": {\n"
	                "    \"title\": \"...\",\n"
	                "    \"description\": \"...\",\n"
	                "    \"hashtags\": [\"...\", \"...\"]\n"
	                "  },\n"
	                "  \"youtube\": {\n"
	                "    \"title\": \"...\",\n"
	                "    \"description\": \"...\",\n"
	                "    \"tags\": [\"...\", \"...\"]\n"
	                "  },\n"
	                "  \"instagram\": {\n"
	                "    \"caption\": \"...\",\n"
	                "    \"hashtags\": [\"...\", \"...\"]\n"
	                "  },\n"
	                "  \"x\": {\n"
	                "    \"tweet\": \"...\",\n"
	                "    \"hashtags\": [\"...\", \"...\"]\n"
	                "  }\n"
	                "}"
	            '''
	        },
	        {
	            "role": "user",
	            "content": data
	        }
	    ],
	    model="deepseek-v3",
	    stream=False
	)

	content = chat_completion.choices[0].message.content
	social_data = parse_json(content)

	return jsonify(social_data), 200
