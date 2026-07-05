console.log("Process env keys:", Object.keys(process.env).filter(k => 
  k.includes("KEY") || k.includes("TOKEN") || k.includes("API") || k.includes("SECRET") || k.includes("GEMINI") || k.includes("OPENAI") || k.includes("CLAUDE") || k.includes("ANTHROPIC")
));
