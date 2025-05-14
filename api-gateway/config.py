import yaml

class Config:
    def __init__(self, path="config.yaml"):
        with open(path) as f:
            data = yaml.safe_load(f)
        self.server = data.get("server", {})
        self.cors = data.get("cors", {})
        self.services = data.get("services", {})
        self.jwt = data.get("jwt", {})

config = Config()
