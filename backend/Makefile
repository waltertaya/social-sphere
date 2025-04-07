# run: python3 app.py
PHONY: run
run:
	python3 app.py

# Create a virtual environment and install the dependencies
PHONY: setup
setup:
	python3 -m venv venv
	source venv/bin/activate && pip install -r requirements.txt

# clean: Remove all the files generated
PHONY: clean
clean:
	rm -rf __pycache__/
	rm -rf htmlcov/
	rm -rf .pytest_cache/
	rm -rf .coverage
	rm -rf .mypy_cache/
	rm -rf */__pycache__/
