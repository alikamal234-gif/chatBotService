
command terminal pour tester le code
```
(Invoke-RestMethod -Uri http://localhost:3005/api/chat -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"messages":[{"role":"user","content":"quell est la relation entre urba group et rizk design?"}]}').response

```