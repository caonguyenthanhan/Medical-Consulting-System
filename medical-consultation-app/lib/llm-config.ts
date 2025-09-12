// Configuration for custom LLM model
export const LLM_CONFIG = {
  // Configurable variables that can be changed later
  adapter_dir: "lora_model",
  model_name: "unsloth/llama-3.1-8b-bnb-4bit",

  // Model parameters
  max_seq_length: 2048,
  max_new_tokens: 512,

  // Generation parameters
  generation_params: {
    use_cache: true,
    do_sample: true,
    top_k: 50,
    top_p: 0.95,
  },
}

// Format prompt similar to Python file
export function createPrompt(question: string): string {
  return `### Question:
${question}

### Answer:
`
}

// Parse response from model (handles different output formats)
export function parseModelResponse(generated_text: string): string {
  if (generated_text.includes("### Answer:")) {
    return generated_text.split("### Answer:")[1].strip().replace("EOS", "")
  } else if (generated_text.includes("### Output:")) {
    return generated_text.split("### Output:")[1].strip().replace("EOS", "")
  } else {
    return generated_text.strip()
  }
}
