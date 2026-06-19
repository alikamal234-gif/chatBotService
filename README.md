
## command terminal pour tester le code

```
(Invoke-RestMethod -Uri http://localhost:3005/api/chat -Method Post -Headers @{"Content-Type"="application/json"} -Body '{
  "messages": [
    { "role": "user", "content": "Salam!" }
  ],
  "apiKeys": [
    "sk-groq-key...",
    "sk-deepseek-key...",
    "sk-gemini-key...",
    "sk-openrouter-key...",
    "sk-nvidia-key..."
  ],
  "personaPath": "src/config/persona.txt",
  "tools": [
    {
      "name": "get products",
      "description": "les produits de rizk design",
      "url": "https://dummyjson.com/products",
      "method": "GET"
    }
  ]
}
').response

```

