import fetch from 'node-fetch';

export async function getEmbeddings(texts: string[]) {
    try {
        const url = "https://api.jina.ai/v1/embeddings";
        const apiKey = "jina_2d9e91aa818845fc8666dfa777c5e544NTqEvln1rXQW4ROHD3is67vou5hK";
    
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        };
    
        const embeddings = [];
    
        for (const text of texts) {
          if (!text.trim()) {
            console.log("Text is empty or contains only whitespace. Skipping.");
            continue;
          }
    
          // Truncate text to 200 characters to avoid NeonDbError
          const truncatedText = text.substring(0, 200);
    
          const data = {
            input: [truncatedText],
            model: 'jina-embeddings-v2-base-en',
          };
    
          const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
          });
    
          const result = await response.json();
    
          // Assuming the API response format is similar to OpenAI's format
          const originalEmbeddings = result.data[0].embedding as number[];
    
          // Reshape the embeddings to the expected dimension (1536)
          const reshapedEmbeddings = [...originalEmbeddings, ...Array(768).fill(0)]; // Fill the remaining dimensions with zeros
    
          embeddings.push(reshapedEmbeddings);
        }
    
        return embeddings;
      } catch (error) {
        console.log("Error calling Jina Embedding API", error);
        throw error;
      }
    }
    
    
    
    