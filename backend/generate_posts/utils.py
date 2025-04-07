import json
import re

def parse_json(content):
	json_str = re.search(r'```json\n(.*)\n```', content, re.DOTALL).group(1)

	social_data = json.loads(json_str)

	return social_data
