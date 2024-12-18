#!/bin/sh

# Wait for ollama to be ready
until curl -s http://ollama:11434/api/tags > /dev/null; do
    echo "Waiting for ollama service to be ready..."
    sleep 2
done

echo "Ollama service is ready. Pulling model: $OLLAMA_MODEL"

# Pull the model and wait for completion
curl -s -X POST http://ollama:11434/api/pull -d "{\"name\":\"$OLLAMA_MODEL\"}" | while read -r line; do
    # Extract completion percentage
    completed=$(echo "$line" | grep -o '"completed":[0-9]*' | cut -d':' -f2)
    total=$(echo "$line" | grep -o '"total":[0-9]*' | cut -d':' -f2)
    
    if [ ! -z "$completed" ] && [ ! -z "$total" ] && [ "$total" -ne 0 ]; then
        percentage=$((completed * 100 / total))
        echo "Pulling model... $percentage%"
    fi
    
    # Check for completion
    if echo "$line" | grep -q '"status":"success"'; then
        break
    fi
done

echo "Model $OLLAMA_MODEL has been pulled successfully"
