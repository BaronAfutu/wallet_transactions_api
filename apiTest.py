import requests

url = 'http://localhost:3000/api/'

x = requests.get(url)

print(x.text)
print(x.status_code)