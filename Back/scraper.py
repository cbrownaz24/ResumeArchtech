import requests
from bs4 import BeautifulSoup
import json
from gpt import get_bullet_points
from dotenv import load_dotenv
import os


def get_repos(github_user):
  load_dotenv()
  token = os.getenv("GITHUB_TOKEN")
  headers = {'Authorization': f'Bearer {token}'}
  url = f"https://api.github.com/users/{github_user}/repos"
  page = requests.get(url, headers=headers)
  repos = page.json()
  parsed_repos = {}
  for repo in repos:
    print(repo['name'])
    languages = requests.get(repo['languages_url'], headers=headers).json()
    readme = requests.get(f"https://raw.githubusercontent.com/{github_user}/{repo['name']}/{repo['default_branch']}/README.md", headers=headers).text
    print(f"https://raw.githubusercontent.com/{github_user}/{repo['name']}/{repo['default_branch']}/README.md")
    parsed_repo = {"name":repo['name'], "url":repo['html_url'], "api_url":repo['url'], "languages":languages, "readme": readme, "selected": False}
    parsed_repos[repo['name']] = parsed_repo

  return parsed_repos


if __name__ == "__main__":
  github_user = "Tim-gubski"
  parsed_repos = get_repos("Tim-gubski")

  good_projects = ['Sustainabite', 'flamenet']

  for project_name in good_projects:
    project = json.dumps(parsed_repos[project_name], sort_keys=True, indent=4)
    bullet_points = get_bullet_points(project)
    parsed_repos[project_name]['bullet_points'] = bullet_points
    print("Project: ", project_name)
    # print(parsed_repos[project_name]['readme'])
    print("Bullet Points: \n", bullet_points)


